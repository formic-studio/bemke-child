<?php
/**
 * One-time, reviewed import of the English Campus Bemke draft copy.
 *
 * The source strings and target IDs come from the page 4600 WXR export.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_campus_translation_page' );
add_action( 'admin_post_bemke_apply_campus_translation', 'bemke_child_apply_campus_translation' );

function bemke_child_register_campus_translation_page() {
	add_management_page(
		'Campus Bemke EN',
		'Campus Bemke EN',
		'manage_options',
		'bemke-campus-translation',
		'bemke_child_render_campus_translation_page'
	);
}

/**
 * @return array<string, mixed>|WP_Error
 */
function bemke_child_get_campus_translation_plan() {
	$path = get_stylesheet_directory() . '/data/campus-bemke-en.php';

	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_plan', 'Nie można odczytać planu tłumaczenia.' );
	}

	$plan = require $path;

	if (
		! is_array( $plan ) ||
		4600 !== ( $plan['target_post_id'] ?? null ) ||
		! isset( $plan['bricks_edits'], $plan['yoast_edits'], $plan['alt_edits'] )
	) {
		return new WP_Error( 'invalid_plan', 'Plan tłumaczenia ma nieprawidłowy format.' );
	}

	return $plan;
}

/**
 * Check every original value before writing anything to the draft.
 *
 * @param array<string, mixed> $plan Translation plan.
 * @return array<string, mixed>|WP_Error
 */
function bemke_child_validate_campus_translation( $plan ) {
	$post_id = (int) $plan['target_post_id'];
	$post    = get_post( $post_id );

	if (
		! $post ||
		'page' !== $post->post_type ||
		'draft' !== $post->post_status ||
		$plan['target_title'] !== $post->post_title ||
		! function_exists( 'pll_get_post_language' ) ||
		'en' !== pll_get_post_language( $post_id, 'slug' )
	) {
		return new WP_Error( 'wrong_target', 'Strona 4600 musi być szkicem Campus Bemke w języku EN.' );
	}

	$elements = get_post_meta( $post_id, '_bricks_page_content_2', true );

	if ( ! is_array( $elements ) ) {
		return new WP_Error( 'missing_bricks', 'Nie znaleziono danych Bricks w szkicu.' );
	}

	$indexes = array();
	foreach ( $elements as $index => $element ) {
		if ( isset( $element['id'] ) ) {
			$indexes[ $element['id'] ] = $index;
		}
	}

	$pending = array( 'bricks' => 0, 'yoast' => 0, 'alt' => 0 );
	$errors  = array();

	foreach ( $plan['bricks_edits'] as $edit ) {
		$id        = $edit['element'];
		$container = $edit['container'];
		$key       = $edit['key'];
		$current   = isset( $indexes[ $id ] )
			? ( $elements[ $indexes[ $id ] ][ $container ][ $key ] ?? null )
			: null;

		if ( $edit['expected'] === $current ) {
			++$pending['bricks'];
		} elseif ( $edit['english'] !== $current ) {
			$errors[] = "Bricks {$id}.{$container}.{$key}: treść szkicu różni się od eksportu.";
		}
	}

	foreach ( $plan['yoast_edits'] as $edit ) {
		$current = (string) get_post_meta( $post_id, $edit['key'], true );
		if ( $edit['expected'] === $current ) {
			++$pending['yoast'];
		} elseif ( $edit['english'] !== $current ) {
			$errors[] = "Yoast {$edit['key']}: pole zmieniło się od czasu eksportu.";
		}
	}

	foreach ( $plan['alt_edits'] as $edit ) {
		$attachment_id = (int) $edit['attachment_id'];
		$attachment    = get_post( $attachment_id );
		$metadata      = wp_get_attachment_metadata( $attachment_id );
		$filename      = $metadata['original_image'] ?? wp_basename( (string) get_attached_file( $attachment_id ) );
		$polish        = (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
		$english       = (string) get_post_meta( $attachment_id, '_bemke_image_alt_en', true );

		if (
			! $attachment ||
			'attachment' !== $attachment->post_type ||
			$edit['filename'] !== $filename ||
			$edit['expected_pl'] !== $polish
		) {
			$errors[] = "ALT {$attachment_id}: obraz lub polski opis różni się od eksportu.";
		} elseif ( '' === $english ) {
			++$pending['alt'];
		} elseif ( $edit['english'] !== $english ) {
			$errors[] = "ALT {$attachment_id}: istnieje już inny opis EN.";
		}
	}

	return array(
		'elements' => $elements,
		'indexes'  => $indexes,
		'pending'  => $pending,
		'errors'   => $errors,
	);
}

function bemke_child_render_campus_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}

	$plan = bemke_child_get_campus_translation_plan();
	?>
	<div class="wrap">
		<h1>Campus Bemke EN — tłumaczenie szkicu</h1>
		<p>Zmiany dotyczą wyłącznie szkicu strony 4600 i angielskich opisów ALT powiązanych obrazów. Status „Szkic” i polskie treści pozostaną bez zmian.</p>
		<?php
		if ( is_wp_error( $plan ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html( $plan->get_error_message() ) . '</p></div>';
			echo '</div>';
			return;
		}

		$state = bemke_child_validate_campus_translation( $plan );
		if ( is_wp_error( $state ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html( $state->get_error_message() ) . '</p></div>';
			echo '</div>';
			return;
		}

		if ( ! empty( $_GET['applied'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			echo '<div class="notice notice-success"><p>Zapisano tłumaczenie w szkicu Campus Bemke EN.</p></div>';
		}

		if ( $state['errors'] ) {
			echo '<div class="notice notice-error"><p>Wstrzymano import, ponieważ:</p><ul>';
			foreach ( $state['errors'] as $error ) {
				echo '<li>' . esc_html( $error ) . '</li>';
			}
			echo '</ul></div>';
		}
		?>
		<p>
			Do zapisania: <?php echo esc_html( (string) $state['pending']['bricks'] ); ?> pól Bricks,
			<?php echo esc_html( (string) $state['pending']['yoast'] ); ?> pól Yoast,
			<?php echo esc_html( (string) $state['pending']['alt'] ); ?> opisów ALT.
		</p>
		<?php if ( ! $state['errors'] && array_sum( $state['pending'] ) > 0 ) : ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="bemke_apply_campus_translation">
				<?php wp_nonce_field( 'bemke_apply_campus_translation' ); ?>
				<?php submit_button( 'Zastosuj tłumaczenie do szkicu EN' ); ?>
			</form>
		<?php endif; ?>
		<details>
			<summary>Podgląd tekstów przed i po tłumaczeniu</summary>
			<table class="widefat striped"><thead><tr><th>Pole</th><th>Obecnie</th><th>Po zmianie</th></tr></thead><tbody>
			<?php foreach ( $plan['bricks_edits'] as $edit ) : ?>
				<tr><td><?php echo esc_html( $edit['element'] . '.' . $edit['container'] . '.' . $edit['key'] ); ?></td><td><?php echo esc_html( wp_strip_all_tags( $edit['expected'], true ) ); ?></td><td><?php echo esc_html( wp_strip_all_tags( $edit['english'], true ) ); ?></td></tr>
			<?php endforeach; ?>
			<?php foreach ( $plan['yoast_edits'] as $edit ) : ?>
				<tr><td><?php echo esc_html( $edit['key'] ); ?></td><td><?php echo esc_html( $edit['expected'] ); ?></td><td><?php echo esc_html( $edit['english'] ); ?></td></tr>
			<?php endforeach; ?>
			<?php foreach ( $plan['alt_edits'] as $edit ) : ?>
				<tr><td><?php echo esc_html( 'ALT EN ' . $edit['attachment_id'] ); ?></td><td>—</td><td><?php echo esc_html( $edit['english'] ); ?></td></tr>
			<?php endforeach; ?>
			</tbody></table>
		</details>
	</div>
	<?php
}

function bemke_child_apply_campus_translation() {
	if ( ! current_user_can( 'manage_options' ) || ! current_user_can( 'edit_post', 4600 ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}

	check_admin_referer( 'bemke_apply_campus_translation' );
	$plan = bemke_child_get_campus_translation_plan();
	if ( is_wp_error( $plan ) ) {
		wp_die( esc_html( $plan->get_error_message() ) );
	}

	$state = bemke_child_validate_campus_translation( $plan );
	if ( is_wp_error( $state ) || $state['errors'] ) {
		wp_die( esc_html( is_wp_error( $state ) ? $state->get_error_message() : implode( ' ', $state['errors'] ) ) );
	}

	if ( 0 === array_sum( $state['pending'] ) ) {
		wp_safe_redirect( admin_url( 'tools.php?page=bemke-campus-translation&applied=1' ) );
		exit;
	}

	$post_id = (int) $plan['target_post_id'];
	if ( ! metadata_exists( 'post', $post_id, '_bemke_campus_en_import_backup' ) ) {
		$backup = array(
			'bricks' => $state['elements'],
			'yoast'  => array(),
			'alts'   => array(),
		);
		foreach ( $plan['yoast_edits'] as $edit ) {
			$backup['yoast'][ $edit['key'] ] = get_post_meta( $post_id, $edit['key'], true );
		}
		foreach ( $plan['alt_edits'] as $edit ) {
			$backup['alts'][ $edit['attachment_id'] ] = get_post_meta( (int) $edit['attachment_id'], '_bemke_image_alt_en', true );
		}
		add_post_meta( $post_id, '_bemke_campus_en_import_backup', $backup, true );
	}

	$elements = $state['elements'];
	foreach ( $plan['bricks_edits'] as $edit ) {
		$index = $state['indexes'][ $edit['element'] ];
		$elements[ $index ][ $edit['container'] ][ $edit['key'] ] = $edit['english'];
	}
	update_post_meta( $post_id, '_bricks_page_content_2', $elements );

	foreach ( $plan['yoast_edits'] as $edit ) {
		update_post_meta( $post_id, $edit['key'], $edit['english'] );
	}

	foreach ( $plan['alt_edits'] as $edit ) {
		update_post_meta( (int) $edit['attachment_id'], '_bemke_image_alt_en', $edit['english'] );
	}

	wp_update_post( array( 'ID' => $post_id, 'post_status' => 'draft' ) );
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-campus-translation&applied=1' ) );
	exit;
}
