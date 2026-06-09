<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'bemke_register_linkedin_posts_cpt' );
add_action( 'init', 'bemke_register_linkedin_post_meta' );
add_action( 'rest_api_init', 'bemke_register_linkedin_webhook_endpoint' );
add_action( 'admin_menu', 'bemke_register_linkedin_settings_page' );
add_action( 'admin_init', 'bemke_handle_linkedin_settings_save' );
add_action( 'add_meta_boxes', 'bemke_add_linkedin_post_details_meta_box' );
add_filter( 'manage_linkedin_post_posts_columns', 'bemke_filter_linkedin_post_admin_columns' );
add_action( 'manage_linkedin_post_posts_custom_column', 'bemke_render_linkedin_post_admin_column', 10, 2 );

const BEMKE_LINKEDIN_WEBHOOK_TOKEN_HASH_OPTION = 'bemke_linkedin_webhook_token_hash';

function bemke_register_linkedin_posts_cpt() {
	register_post_type(
		'linkedin_post',
		array(
			'labels'              => array(
				'name'          => 'Posty LinkedIn',
				'singular_name' => 'Post LinkedIn',
				'add_new_item'  => 'Dodaj post LinkedIn',
				'edit_item'     => 'Edytuj post LinkedIn',
			),
			'public'              => true,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'has_archive'         => false,
			'rewrite'             => false,
			'show_in_rest'        => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-share',
			'supports'            => array( 'title', 'editor', 'excerpt', 'custom-fields' ),
		)
	);
}

function bemke_register_linkedin_post_meta() {
	$meta_fields = array(
		'li_post_id'      => 'sanitize_text_field',
		'li_post_url'     => 'esc_url_raw',
		'li_image_url'    => 'esc_url_raw',
		'li_author'       => 'sanitize_text_field',
		'li_published_at' => 'sanitize_text_field',
	);

	foreach ( $meta_fields as $meta_key => $sanitize_callback ) {
		register_post_meta(
			'linkedin_post',
			$meta_key,
			array(
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => $sanitize_callback,
				'auth_callback'     => '__return_true',
			)
		);
	}
}

function bemke_register_linkedin_webhook_endpoint() {
	register_rest_route(
		'bemke/v1',
		'/linkedin-post',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'bemke_handle_linkedin_post_webhook',
			'permission_callback' => 'bemke_validate_linkedin_webhook_token',
		)
	);
}

function bemke_validate_linkedin_webhook_token( WP_REST_Request $request ) {
	$token = (string) $request->get_header( 'X-Secret-Token' );

	if ( '' === $token ) {
		return new WP_Error(
			'bemke_linkedin_invalid_token',
			'Invalid LinkedIn webhook token.',
			array( 'status' => 403 )
		);
	}

	if ( defined( 'BEMKE_LINKEDIN_WEBHOOK_TOKEN' ) && '' !== BEMKE_LINKEDIN_WEBHOOK_TOKEN ) {
		if ( hash_equals( (string) BEMKE_LINKEDIN_WEBHOOK_TOKEN, $token ) ) {
			return true;
		}

		return new WP_Error(
			'bemke_linkedin_invalid_token',
			'Invalid LinkedIn webhook token.',
			array( 'status' => 403 )
		);
	}

	$stored_token_hash = (string) get_option( BEMKE_LINKEDIN_WEBHOOK_TOKEN_HASH_OPTION, '' );

	if ( '' === $stored_token_hash ) {
		return new WP_Error(
			'bemke_linkedin_token_missing',
			'LinkedIn webhook token is not configured.',
			array( 'status' => 503 )
		);
	}

	if ( ! hash_equals( $stored_token_hash, bemke_hash_linkedin_webhook_token( $token ) ) ) {
		return new WP_Error(
			'bemke_linkedin_invalid_token',
			'Invalid LinkedIn webhook token.',
			array( 'status' => 403 )
		);
	}

	return true;
}

function bemke_register_linkedin_settings_page() {
	add_options_page(
		'Bemke LinkedIn',
		'Bemke LinkedIn',
		'manage_options',
		'bemke-linkedin',
		'bemke_render_linkedin_settings_page'
	);
}

function bemke_handle_linkedin_settings_save() {
	if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( ! isset( $_POST['bemke_linkedin_settings_nonce'] ) ) {
		return;
	}

	check_admin_referer( 'bemke_save_linkedin_settings', 'bemke_linkedin_settings_nonce' );

	$redirect_url = add_query_arg(
		array(
			'page'                  => 'bemke-linkedin',
			'bemke_linkedin_saved'  => '1',
		),
		admin_url( 'options-general.php' )
	);

	if ( isset( $_POST['bemke_clear_linkedin_token'] ) ) {
		delete_option( BEMKE_LINKEDIN_WEBHOOK_TOKEN_HASH_OPTION );
		wp_safe_redirect( $redirect_url );
		exit;
	}

	$new_token = isset( $_POST['bemke_linkedin_webhook_token'] ) ? trim( (string) wp_unslash( $_POST['bemke_linkedin_webhook_token'] ) ) : '';

	if ( '' !== $new_token ) {
		update_option( BEMKE_LINKEDIN_WEBHOOK_TOKEN_HASH_OPTION, bemke_hash_linkedin_webhook_token( $new_token ), false );
	}

	wp_safe_redirect( $redirect_url );
	exit;
}

function bemke_render_linkedin_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$has_constant_token = defined( 'BEMKE_LINKEDIN_WEBHOOK_TOKEN' ) && '' !== BEMKE_LINKEDIN_WEBHOOK_TOKEN;
	$has_option_token   = '' !== (string) get_option( BEMKE_LINKEDIN_WEBHOOK_TOKEN_HASH_OPTION, '' );
	$endpoint_url       = rest_url( 'bemke/v1/linkedin-post' );
	?>
	<div class="wrap">
		<h1>Bemke LinkedIn</h1>

		<?php if ( isset( $_GET['bemke_linkedin_saved'] ) ) : ?>
			<div class="notice notice-success is-dismissible">
				<p>Ustawienia LinkedIn zostały zapisane.</p>
			</div>
		<?php endif; ?>

		<p>Ten panel ustawia token dla webhooka Make. Token nie jest zapisywany jawnie w bazie, tylko jako hash.</p>

		<table class="form-table" role="presentation">
			<tr>
				<th scope="row">Endpoint dla Make</th>
				<td><code><?php echo esc_html( $endpoint_url ); ?></code></td>
			</tr>
			<tr>
				<th scope="row">Status tokenu</th>
				<td>
					<?php if ( $has_constant_token ) : ?>
						Token jest ustawiony w <code>wp-config.php</code>.
					<?php elseif ( $has_option_token ) : ?>
						Token jest ustawiony w panelu WordPress.
					<?php else : ?>
						Token nie jest jeszcze ustawiony.
					<?php endif; ?>
				</td>
			</tr>
		</table>

		<form method="post" action="">
			<?php wp_nonce_field( 'bemke_save_linkedin_settings', 'bemke_linkedin_settings_nonce' ); ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="bemke_linkedin_webhook_token">Nowy token webhooka</label>
					</th>
					<td>
						<input
							type="password"
							id="bemke_linkedin_webhook_token"
							name="bemke_linkedin_webhook_token"
							class="regular-text"
							autocomplete="new-password"
						>
						<p class="description">Wklej tu ten sam token, który potem wpiszesz w Make jako nagłówek <code>X-Secret-Token</code>.</p>
					</td>
				</tr>
			</table>

			<?php submit_button( 'Zapisz token' ); ?>

			<?php if ( ! $has_constant_token && $has_option_token ) : ?>
				<p>
					<button type="submit" name="bemke_clear_linkedin_token" value="1" class="button button-secondary">
						Usuń token
					</button>
				</p>
			<?php endif; ?>
		</form>
	</div>
	<?php
}

function bemke_hash_linkedin_webhook_token( $token ) {
	return hash_hmac( 'sha256', (string) $token, wp_salt( 'auth' ) );
}

function bemke_handle_linkedin_post_webhook( WP_REST_Request $request ) {
	$body = $request->get_json_params();

	if ( ! is_array( $body ) ) {
		$body = $request->get_body_params();
	}

	if ( ! is_array( $body ) || empty( $body ) ) {
		$body = $request->get_params();
	}

	if ( ! is_array( $body ) || empty( $body ) ) {
		return new WP_Error(
			'bemke_linkedin_invalid_payload',
			'Invalid request payload.',
			array( 'status' => 400 )
		);
	}

	$post_id_raw = bemke_get_linkedin_payload_value( $body, array( 'post_id', 'id' ) );
	$post_id     = sanitize_text_field( (string) $post_id_raw );
	$post_text   = bemke_get_linkedin_first_line(
		sanitize_textarea_field( (string) bemke_get_linkedin_payload_value( $body, array( 'post_text', 'commentary', 'text' ) ) )
	);

	if ( '' === $post_id ) {
		return new WP_Error(
			'bemke_linkedin_missing_post_id',
			'Missing post_id.',
			array( 'status' => 400 )
		);
	}

	$published_at = sanitize_text_field( (string) bemke_get_linkedin_payload_value( $body, array( 'published_at', 'publishedAt' ) ) );
	$post_url     = esc_url_raw( (string) bemke_get_linkedin_payload_value( $body, array( 'post_url', 'url', 'content_landing_page' ) ) );
	$image_url    = esc_url_raw( (string) bemke_get_linkedin_payload_value( $body, array( 'image_url', 'imageUrl' ) ) );
	$author       = sanitize_text_field( (string) bemke_get_linkedin_payload_value( $body, array( 'author', 'author_id', 'authorId' ) ) );
	$post_dates   = bemke_parse_linkedin_post_dates( $published_at );
	$title        = bemke_get_linkedin_post_title( $post_text, $published_at );
	$existing_id  = bemke_get_linkedin_post_id_by_remote_id( $post_id );

	$post_data = array(
		'post_type'    => 'linkedin_post',
		'post_title'   => $title,
		'post_content' => $post_text,
		'post_excerpt' => wp_trim_words( wp_strip_all_tags( $post_text ), 24, '...' ),
		'post_status'  => 'publish',
	);

	if ( $post_dates['post_date'] && $post_dates['post_date_gmt'] ) {
		$post_data['post_date']     = $post_dates['post_date'];
		$post_data['post_date_gmt'] = $post_dates['post_date_gmt'];
	}

	if ( $existing_id ) {
		$post_data['ID'] = $existing_id;
		$wp_post_id      = wp_update_post( $post_data, true );
		$status          = 'updated';
		$response_code   = 200;
	} else {
		$wp_post_id    = wp_insert_post( $post_data, true );
		$status        = 'created';
		$response_code = 201;
	}

	if ( is_wp_error( $wp_post_id ) ) {
		return $wp_post_id;
	}

	update_post_meta( $wp_post_id, 'li_post_id', $post_id );
	update_post_meta( $wp_post_id, 'li_post_url', $post_url );
	update_post_meta( $wp_post_id, 'li_image_url', $image_url );
	update_post_meta( $wp_post_id, 'li_author', $author );
	update_post_meta( $wp_post_id, 'li_published_at', $published_at );

	return new WP_REST_Response(
		array(
			'status'         => $status,
			'id'             => $wp_post_id,
			'li_post_id'     => $post_id,
			'li_post_url'    => $post_url,
			'li_published_at' => $published_at,
		),
		$response_code
	);
}

function bemke_get_linkedin_payload_value( array $body, array $keys ) {
	foreach ( $keys as $key ) {
		if ( isset( $body[ $key ] ) ) {
			return $body[ $key ];
		}
	}

	return '';
}

function bemke_get_linkedin_first_line( $text ) {
	$text = trim( (string) $text );

	if ( '' === $text ) {
		return '';
	}

	$lines = preg_split( '/\R/', $text );

	if ( ! is_array( $lines ) || empty( $lines ) ) {
		return $text;
	}

	return trim( (string) $lines[0] );
}

function bemke_get_linkedin_post_id_by_remote_id( $remote_post_id ) {
	$posts = get_posts(
		array(
			'post_type'              => 'linkedin_post',
			'post_status'            => 'any',
			'fields'                 => 'ids',
			'numberposts'            => 1,
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'meta_key'               => 'li_post_id',
			'meta_value'             => $remote_post_id,
		)
	);

	return empty( $posts ) ? 0 : (int) $posts[0];
}

function bemke_parse_linkedin_post_dates( $published_at ) {
	if ( '' === $published_at ) {
		return array(
			'post_date'     => null,
			'post_date_gmt' => null,
		);
	}

	$timestamp = strtotime( $published_at );

	if ( false === $timestamp ) {
		return array(
			'post_date'     => null,
			'post_date_gmt' => null,
		);
	}

	$post_date_gmt = gmdate( 'Y-m-d H:i:s', $timestamp );

	return array(
		'post_date'     => get_date_from_gmt( $post_date_gmt ),
		'post_date_gmt' => $post_date_gmt,
	);
}

function bemke_get_linkedin_post_title( $post_text, $published_at ) {
	$title = wp_trim_words( wp_strip_all_tags( $post_text ), 10, '...' );

	if ( '' !== $title ) {
		return $title;
	}

	if ( '' !== $published_at ) {
		return sprintf( 'Post LinkedIn - %s', $published_at );
	}

	return 'Post LinkedIn';
}

function bemke_add_linkedin_post_details_meta_box() {
	add_meta_box(
		'bemke_linkedin_post_details',
		'Dane LinkedIn',
		'bemke_render_linkedin_post_details_meta_box',
		'linkedin_post',
		'side',
		'default'
	);
}

function bemke_render_linkedin_post_details_meta_box( WP_Post $post ) {
	$fields = array(
		'ID posta'          => get_post_meta( $post->ID, 'li_post_id', true ),
		'URL posta'         => get_post_meta( $post->ID, 'li_post_url', true ),
		'Data z LinkedIn'   => get_post_meta( $post->ID, 'li_published_at', true ),
		'Autor'             => get_post_meta( $post->ID, 'li_author', true ),
		'URL obrazka'       => get_post_meta( $post->ID, 'li_image_url', true ),
	);
	?>
	<div class="bemke-linkedin-post-details">
		<?php foreach ( $fields as $label => $value ) : ?>
			<p>
				<strong><?php echo esc_html( $label ); ?>:</strong><br>
				<?php if ( '' === (string) $value ) : ?>
					<span aria-hidden="true">-</span>
				<?php elseif ( 0 === strpos( (string) $value, 'http' ) ) : ?>
					<a href="<?php echo esc_url( $value ); ?>" target="_blank" rel="noopener noreferrer">
						<?php echo esc_html( $value ); ?>
					</a>
				<?php else : ?>
					<code><?php echo esc_html( $value ); ?></code>
				<?php endif; ?>
			</p>
		<?php endforeach; ?>
	</div>
	<?php
}

function bemke_filter_linkedin_post_admin_columns( $columns ) {
	$new_columns = array();

	foreach ( $columns as $key => $label ) {
		$new_columns[ $key ] = $label;

		if ( 'title' === $key ) {
			$new_columns['bemke_linkedin_post_url'] = 'Link LinkedIn';
			$new_columns['bemke_linkedin_post_id']  = 'ID LinkedIn';
		}
	}

	return $new_columns;
}

function bemke_render_linkedin_post_admin_column( $column, $post_id ) {
	if ( 'bemke_linkedin_post_url' === $column ) {
		$post_url = get_post_meta( $post_id, 'li_post_url', true );

		if ( '' === $post_url ) {
			echo '<span aria-hidden="true">-</span>';
			return;
		}

		printf(
			'<a href="%s" target="_blank" rel="noopener noreferrer">Otwórz</a>',
			esc_url( $post_url )
		);
		return;
	}

	if ( 'bemke_linkedin_post_id' === $column ) {
		$remote_id = get_post_meta( $post_id, 'li_post_id', true );
		echo '' === $remote_id ? '<span aria-hidden="true">-</span>' : '<code>' . esc_html( $remote_id ) . '</code>';
	}
}
