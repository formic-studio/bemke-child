<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BEMKE_INSTAGRAM_FEED_CACHE_TIMEOUT = 15 * MINUTE_IN_SECONDS;
const BEMKE_INSTAGRAM_FEED_LIMIT_MAX   = 12;
const BEMKE_INSTAGRAM_USER_ID_OPTION     = 'bemke_instagram_user_id';
const BEMKE_INSTAGRAM_ACCESS_TOKEN_OPTION = 'bemke_instagram_access_token';

add_action( 'init', 'bemke_register_instagram_feed_shortcode' );
add_filter( 'the_content', 'bemke_append_instagram_feed_to_falcons_page', 20 );
add_action( 'admin_menu', 'bemke_register_instagram_settings_page' );
add_action( 'admin_init', 'bemke_handle_instagram_settings_save' );

function bemke_register_instagram_feed_shortcode() {
	add_shortcode( 'bemke_instagram_feed', 'bemke_render_instagram_feed_shortcode' );
}

function bemke_render_instagram_feed_shortcode( $atts = array() ) {
	$atts = shortcode_atts(
		array(
			'limit'        => 8,
			'columns'      => 4,
			'user_id'      => '',
			'access_token' => '',
			'class'        => 'bemke-instagram-feed',
		),
		$atts,
		'bemke_instagram_feed'
	);

	$limit   = min( max( 1, absint( $atts['limit'] ) ), BEMKE_INSTAGRAM_FEED_LIMIT_MAX );
	$columns = min( max( 2, absint( $atts['columns'] ) ), 6 );
	$user_id = sanitize_text_field( (string) $atts['user_id'] );
	$token   = sanitize_text_field( (string) $atts['access_token'] );
	$class   = sanitize_html_class( (string) $atts['class'] );

	$posts = bemke_get_instagram_feed_posts( $limit, $user_id, $token );

	if ( is_wp_error( $posts ) ) {
		if ( current_user_can( 'manage_options' ) ) {
			return sprintf(
				'<p class="bemke-instagram-feed__error">%s</p>',
				esc_html( $posts->get_error_message() )
			);
		}

		return '';
	}

	if ( empty( $posts ) ) {
		return '<p class="bemke-instagram-feed__error">Brak postów z Instagrama.</p>';
	}

	$container_id = uniqid( 'bemke-instagram-feed-' );
	$output       = '';
	$grid_style   = sprintf( 'style="--bemke-instagram-columns:%1$d"', absint( $columns ) );

	$output .= sprintf( '<section class="%1$s" id="%2$s">', esc_attr( $class ), esc_attr( $container_id ) );
	$output .= '<div class="bemke-instagram-feed__grid" ' . $grid_style . '>';

	foreach ( $posts as $post ) {
		if ( empty( $post['permalink'] ) || empty( $post['media_url'] ) ) {
			continue;
		}

		$caption       = isset( $post['caption'] ) ? sanitize_text_field( (string) $post['caption'] ) : '';
		$image_alt     = '' !== $caption ? wp_strip_all_tags( $caption ) : 'Post z Instagrama';
		$media_caption = wp_trim_words( $image_alt, 8, '...' );

		$output .= sprintf(
			'<a class="bemke-instagram-feed__item" href="%1$s" target="_blank" rel="noopener noreferrer" aria-label="%2$s">
				<img loading="lazy" src="%3$s" alt="%2$s">
			</a>',
			esc_url( $post['permalink'] ),
			esc_attr( $media_caption ),
			esc_url( $post['media_url'] )
		);
	}

	$output .= '</div>';
	$output .= '</section>';

	return $output;
}

function bemke_append_instagram_feed_to_falcons_page( $content ) {
	if ( is_admin() || ! is_page( 'falcons-wadowice' ) ) {
		return $content;
	}

	if ( has_shortcode( $content, 'bemke_instagram_feed' ) ) {
		return $content;
	}

	$settings = bemke_get_instagram_feed_settings( '', '' );

	if ( ! $settings['user_id'] || ! $settings['access_token'] ) {
		if ( current_user_can( 'manage_options' ) ) {
			$content .= '<p class="bemke-instagram-feed__error">Brakuje ustawień Instagrama (User ID lub Access Token).</p>';
		}

		return $content;
	}

	return $content . do_shortcode( '[bemke_instagram_feed]' );
}

function bemke_get_instagram_feed_posts( $limit = 8, $user_id = '', $access_token = '' ) {
	$settings = bemke_get_instagram_feed_settings( (string) $user_id, (string) $access_token );

	if ( '' === $settings['user_id'] || '' === $settings['access_token'] ) {
		return new WP_Error(
			'bemke_instagram_missing_credentials',
			'Nie ustawiono konfiguracji Instagrama (user_id albo access_token).'
		);
	}

	$limit         = min( max( 1, absint( $limit ) ), BEMKE_INSTAGRAM_FEED_LIMIT_MAX );
	$transient_key = sprintf(
		'bemke_instagram_feed_%1$s_%2$d',
		md5( $settings['user_id'] ),
		$limit
	);

	$cached = get_transient( $transient_key );

	if ( false !== $cached ) {
		return $cached;
	}

	$request_url = add_query_arg(
		array(
			'fields'       => 'id,caption,media_type,media_url,permalink,thumbnail_url',
			'limit'        => $limit,
			'access_token' => $settings['access_token'],
		),
		sprintf( 'https://graph.instagram.com/%s/media', rawurlencode( $settings['user_id'] ) )
	);

	$response = wp_remote_get(
		$request_url,
		array(
			'timeout'    => 12,
			'user-agent' => 'Bemke-Instagram-Feed',
		)
	);

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$code = wp_remote_retrieve_response_code( $response );
	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( (string) $body, true );

	if ( 200 !== $code || ! is_array( $data ) ) {
		return new WP_Error(
			'bemke_instagram_api_error',
			'Instagram API zwróciło błąd lub nieprawidłową odpowiedź.'
		);
	}

	if ( isset( $data['error'] ) && is_array( $data['error'] ) ) {
		return new WP_Error(
			'bemke_instagram_api_error',
			sanitize_text_field( $data['error']['message'] ?? 'Błąd API Instagrama.' )
		);
	}

	$items = isset( $data['data'] ) && is_array( $data['data'] ) ? $data['data'] : array();
	$posts = array();

	foreach ( $items as $item ) {
		if ( ! is_array( $item ) ) {
			continue;
		}

		$media_type = isset( $item['media_type'] ) ? (string) $item['media_type'] : '';

		if ( 'VIDEO' === $media_type ) {
			continue;
		}

		$media_url = isset( $item['media_url'] ) ? (string) $item['media_url'] : '';

		if ( 'CAROUSEL_ALBUM' === $media_type && '' === $media_url && isset( $item['thumbnail_url'] ) ) {
			$media_url = (string) $item['thumbnail_url'];
		}

		$posts[] = array(
			'id'         => isset( $item['id'] ) ? (string) $item['id'] : '',
			'permalink'  => isset( $item['permalink'] ) ? (string) $item['permalink'] : '',
			'media_url'  => $media_url,
			'caption'    => isset( $item['caption'] ) ? (string) $item['caption'] : '',
			'media_type' => $media_type,
		);
	}

	set_transient( $transient_key, $posts, BEMKE_INSTAGRAM_FEED_CACHE_TIMEOUT );

	return $posts;
}

function bemke_get_instagram_feed_settings( $user_id = '', $access_token = '' ) {
	$user_id = trim( (string) $user_id );
	$token   = trim( (string) $access_token );

	if ( '' === $user_id && defined( 'BEMKE_INSTAGRAM_USER_ID' ) ) {
		$user_id = trim( (string) BEMKE_INSTAGRAM_USER_ID );
	} elseif ( '' === $user_id ) {
		$user_id = (string) get_option( BEMKE_INSTAGRAM_USER_ID_OPTION, '' );
	}

	if ( '' === $token && defined( 'BEMKE_INSTAGRAM_ACCESS_TOKEN' ) ) {
		$token = trim( (string) BEMKE_INSTAGRAM_ACCESS_TOKEN );
	} elseif ( '' === $token ) {
		$token = (string) get_option( BEMKE_INSTAGRAM_ACCESS_TOKEN_OPTION, '' );
	}

	return array(
		'user_id'      => $user_id,
		'access_token' => $token,
	);
}

function bemke_register_instagram_settings_page() {
	add_options_page(
		'Bemke Instagram',
		'Bemke Instagram',
		'manage_options',
		'bemke-instagram',
		'bemke_render_instagram_settings_page'
	);
}

function bemke_handle_instagram_settings_save() {
	if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( ! isset( $_POST['bemke_instagram_settings_nonce'] ) ) {
		return;
	}

	check_admin_referer( 'bemke_save_instagram_settings', 'bemke_instagram_settings_nonce' );

	$redirect_url = add_query_arg(
		array(
			'page'                   => 'bemke-instagram',
			'bemke_instagram_saved'   => '1',
		),
		admin_url( 'options-general.php' )
	);

	if ( isset( $_POST['bemke_clear_instagram_token'] ) ) {
		delete_option( BEMKE_INSTAGRAM_ACCESS_TOKEN_OPTION );
		delete_option( BEMKE_INSTAGRAM_USER_ID_OPTION );
		wp_safe_redirect( $redirect_url );
		exit;
	}

	if ( defined( 'BEMKE_INSTAGRAM_USER_ID' ) || defined( 'BEMKE_INSTAGRAM_ACCESS_TOKEN' ) ) {
		wp_safe_redirect(
			add_query_arg(
				array(
					'page'                  => 'bemke-instagram',
					'bemke_instagram_info'  => '1',
				),
				admin_url( 'options-general.php' )
			)
		);
		exit;
	}

	$settings = bemke_parse_instagram_settings_post();
	update_option( BEMKE_INSTAGRAM_USER_ID_OPTION, $settings['user_id'], false );
	update_option( BEMKE_INSTAGRAM_ACCESS_TOKEN_OPTION, $settings['access_token'], false );
	bemke_clear_instagram_feed_cache();
	wp_safe_redirect( $redirect_url );
	exit;
}

function bemke_parse_instagram_settings_post() {
	$user_id     = isset( $_POST['bemke_instagram_user_id'] ) ? (string) wp_unslash( $_POST['bemke_instagram_user_id'] ) : '';
	$access_token = isset( $_POST['bemke_instagram_access_token'] ) ? (string) wp_unslash( $_POST['bemke_instagram_access_token'] ) : '';
	$stored_token = (string) get_option( BEMKE_INSTAGRAM_ACCESS_TOKEN_OPTION, '' );
	$parsed_token = sanitize_text_field( trim( $access_token ) );

	if ( '' === $parsed_token ) {
		$parsed_token = $stored_token;
	}

	return array(
		'user_id'     => sanitize_text_field( trim( $user_id ) ),
		'access_token' => $parsed_token,
	);
}

function bemke_render_instagram_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$stored_user_id = (string) get_option( BEMKE_INSTAGRAM_USER_ID_OPTION, '' );
	$stored_token   = (string) get_option( BEMKE_INSTAGRAM_ACCESS_TOKEN_OPTION, '' );
	$has_constant_user_id = defined( 'BEMKE_INSTAGRAM_USER_ID' ) && '' !== (string) BEMKE_INSTAGRAM_USER_ID;
	$has_constant_token   = defined( 'BEMKE_INSTAGRAM_ACCESS_TOKEN' ) && '' !== (string) BEMKE_INSTAGRAM_ACCESS_TOKEN;
	$user_id             = $has_constant_user_id ? (string) BEMKE_INSTAGRAM_USER_ID : $stored_user_id;
	$token_masked        = $has_constant_token || '' !== $stored_token ? str_repeat( '*', 24 ) : '';
	$token_label         = $has_constant_token ? 'Token ustawiony w wp-config.php' : $token_masked;
	?>
	<div class="wrap">
		<h1>Bemke Instagram</h1>

		<?php if ( isset( $_GET['bemke_instagram_saved'] ) ) : ?>
			<div class="notice notice-success is-dismissible">
				<p>Ustawienia Instagrama zostały zapisane.</p>
			</div>
		<?php endif; ?>

		<?php if ( isset( $_GET['bemke_instagram_info'] ) ) : ?>
			<div class="notice notice-info is-dismissible">
				<p>Instagram jest również ustawiony stałymi w <code>wp-config.php</code>. Wyłącz je tam, aby edytować tutaj.</p>
			</div>
		<?php endif; ?>

		<p>Tu możesz dodać dane konta Instagram dla feedu na stronie <strong>falcons-wadowice</strong>.</p>

		<?php if ( $has_constant_user_id || $has_constant_token ) : ?>
			<div class="notice notice-warning is-dismissible">
				<p>Część ustawień jest nadpisywana przez <code>wp-config.php</code>.</p>
			</div>
		<?php endif; ?>

		<form method="post" action="">
			<?php wp_nonce_field( 'bemke_save_instagram_settings', 'bemke_instagram_settings_nonce' ); ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="bemke_instagram_user_id">Instagram User ID</label>
					</th>
					<td>
						<input
							type="text"
							id="bemke_instagram_user_id"
							name="bemke_instagram_user_id"
							class="regular-text"
							value="<?php echo esc_attr( '' === (string) $user_id ? '' : $user_id ); ?>"
							<?php disabled( $has_constant_user_id ); ?>
						>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="bemke_instagram_access_token">Instagram Access Token</label>
					</th>
					<td>
						<input
							type="password"
							id="bemke_instagram_access_token"
							name="bemke_instagram_access_token"
							class="regular-text"
							value=""
							placeholder="<?php echo esc_attr( $token_label ); ?>"
							autocomplete="new-password"
							<?php disabled( $has_constant_token ); ?>
						>
						<p class="description">
							Jeśli zostawisz pole puste, bieżący token w bazie nie zostanie skasowany.
						</p>
					</td>
				</tr>
			</table>

			<?php if ( ! $has_constant_user_id && ! $has_constant_token ) : ?>
				<?php submit_button( 'Zapisz ustawienia' ); ?>
				<button type="submit" name="bemke_clear_instagram_token" value="1" class="button button-secondary">
					Wyczyść ustawienia
				</button>
			<?php else : ?>
				<button type="submit" name="bemke_clear_instagram_token" value="1" class="button button-secondary">
					Wyłącz ustawienia z panelu i użyj wp-config
				</button>
			<?php endif; ?>
		</form>
	</div>
	<?php
}

function bemke_clear_instagram_feed_cache() {
	$raw_user_id = get_option( BEMKE_INSTAGRAM_USER_ID_OPTION, '' );

	if ( '' === trim( (string) $raw_user_id ) ) {
		return;
	}

	$user_id_hash = md5( $raw_user_id );

	for ( $limit = 1; $limit <= BEMKE_INSTAGRAM_FEED_LIMIT_MAX; $limit++ ) {
		delete_transient( sprintf( 'bemke_instagram_feed_%1$s_%2$d', $user_id_hash, $limit ) );
	}
}
