<?php
/** English drafts for shared Bricks 404, press, donor and job templates. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_dynamic_templates_translation_page' );
add_action( 'admin_post_bemke_create_dynamic_templates_en_drafts', 'bemke_child_create_dynamic_templates_en_drafts' );

function bemke_child_register_dynamic_templates_translation_page() {
	add_management_page( 'Bemke EN — szablony treści', 'Bemke EN — szablony treści', 'manage_options', 'bemke-dynamic-templates-en', 'bemke_child_render_dynamic_templates_translation_page' );
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_dynamic_templates_batch() {
	$path = get_stylesheet_directory() . '/data/dynamic-templates-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_batch', 'Brakuje planu szablonów EN.' );
	}
	$batch = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$ids   = array( 1464, 2824, 2856, 2889 );
	if ( ! is_array( $batch ) || 'dynamic-templates-1' !== ( $batch['batch'] ?? null ) || ! isset( $batch['plans'] ) || ! is_array( $batch['plans'] ) || count( $batch['plans'] ) !== count( $ids ) ) {
		return new WP_Error( 'invalid_batch', 'Plan szablonów EN jest nieprawidłowy.' );
	}
	foreach ( $batch['plans'] as $index => $plan ) {
		if ( ! is_array( $plan ) || $ids[ $index ] !== ( $plan['source_post_id'] ?? null ) || ! isset( $plan['source_post_title'], $plan['source_template_type'], $plan['source_bricks_sha256'], $plan['source_bricks_elements'], $plan['target_title'], $plan['bricks_edits'] ) || ! is_array( $plan['bricks_edits'] ) ) {
			return new WP_Error( 'invalid_batch', 'Plan zawiera nieprawidłowy szablon.' );
		}
	}
	return $batch;
}

/** @return array<string, mixed> */
function bemke_child_validate_dynamic_templates_batch( $batch ) {
	$state = array( 'errors' => array(), 'ready' => array(), 'existing' => array(), 'orphans' => array() );
	foreach ( array( 'pll_get_post_language', 'pll_get_post', 'pll_get_post_translations', 'pll_set_post_language', 'pll_save_post_translations' ) as $name ) {
		if ( ! function_exists( $name ) ) {
			$state['errors'][] = 'Polylang musi być aktywny.';
			return $state;
		}
	}
	if ( function_exists( 'pll_is_translated_post_type' ) && ! pll_is_translated_post_type( 'bricks_template' ) ) {
		$state['errors'][] = 'Włącz typ bricks_template w ustawieniach Polylang.';
		return $state;
	}
	$options = get_option( 'polylang', array() );
	if ( is_array( $options ) && in_array( 'post_meta', (array) ( $options['sync'] ?? array() ), true ) ) {
		$state['errors'][] = 'Wyłącz synchronizację pól własnych w Polylang.';
	}
	foreach ( $batch['plans'] as $plan ) {
		$id     = (int) $plan['source_post_id'];
		$source = get_post( $id );
		if ( ! $source || 'bricks_template' !== $source->post_type || 'publish' !== $source->post_status || 'pl' !== pll_get_post_language( $id, 'slug' ) || ! current_user_can( 'edit_post', $id ) || $source->post_title !== $plan['source_post_title'] || get_post_meta( $id, '_bricks_template_type', true ) !== $plan['source_template_type'] ) {
			$state['errors'][] = 'Szablon PL ' . $id . ' zmienił się od eksportu albo nie jest przypisany do PL.';
			continue;
		}
		$existing = (int) pll_get_post( $id, 'en' );
		$orphans  = get_posts( array( 'post_type' => 'bricks_template', 'post_status' => array( 'draft', 'pending', 'private', 'publish', 'future' ), 'meta_key' => '_bemke_dynamic_template_en_source_id', 'meta_value' => (string) $id, 'posts_per_page' => 1, 'suppress_filters' => true ) );
		if ( $existing ) {
			$state['existing'][ $id ] = $existing;
			continue;
		}
		if ( $orphans ) {
			$state['orphans'][ $id ] = (int) $orphans[0]->ID;
			continue;
		}
		$elements = get_post_meta( $id, '_bricks_page_content_2', true );
		if ( ! is_array( $elements ) || count( $elements ) !== (int) $plan['source_bricks_elements'] || ! hash_equals( $plan['source_bricks_sha256'], hash( 'sha256', serialize( $elements ) ) ) ) {
			$state['errors'][] = 'Układ Bricks szablonu ' . $id . ' zmienił się od eksportu.';
			continue;
		}
		$indexes = array();
		foreach ( $elements as $index => $element ) {
			if ( isset( $element['id'] ) ) {
				$indexes[ $element['id'] ] = $index;
			}
		}
		foreach ( $plan['bricks_edits'] as $edit ) {
			$index = $indexes[ $edit['element'] ?? '' ] ?? null;
			if ( null === $index || ! isset( $edit['path'], $edit['expected'], $edit['english'] ) || bemke_child_main_pages_read_path( $elements[ $index ], $edit['path'] ) !== $edit['expected'] ) {
				$state['errors'][] = 'Pole Bricks szablonu ' . $id . ' zmieniło się od eksportu.';
			}
		}
		$state['ready'][ $id ] = array( 'source' => $source, 'elements' => $elements, 'indexes' => $indexes );
	}
	return $state;
}

function bemke_child_render_dynamic_templates_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$batch = bemke_child_get_dynamic_templates_batch();
	echo '<div class="wrap"><h1>Bemke EN — szablony treści</h1>';
	if ( is_wp_error( $batch ) ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $batch->get_error_message() ) . '</p></div></div>';
		return;
	}
	$state = bemke_child_validate_dynamic_templates_batch( $batch );
	if ( isset( $_GET['created'] ) ) {
		echo '<div class="notice notice-success"><p>Utworzono szkice szablonów EN.</p></div>';
	}
	foreach ( $state['errors'] as $error ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $error ) . '</p></div>';
	}
	foreach ( $state['orphans'] as $id => $orphan ) {
		echo '<div class="notice notice-warning"><p>' . esc_html( 'Szablon PL ' . $id . ' ma szkic bez połączenia Polylang: ' . $orphan . '.' ) . '</p></div>';
	}
	echo '<p>Szablony 404, komunikatu prasowego, darczyńcy i oferty pracy: tłumaczenie wspólnych etykiet bez zmiany szablonów PL. Do utworzenia: ' . esc_html( (string) count( $state['ready'] ) ) . '.</p>';
	if ( ! $state['errors'] && ! $state['orphans'] && $state['ready'] ) {
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="bemke_create_dynamic_templates_en_drafts">';
		wp_nonce_field( 'bemke_create_dynamic_templates_en_drafts' );
		submit_button( 'Utwórz szkice szablonów EN' );
		echo '</form>';
	}
	foreach ( $batch['plans'] as $plan ) {
		$id = (int) $plan['source_post_id'];
		echo '<details><summary>' . esc_html( $plan['source_post_title'] . ' → ' . $plan['target_title'] . ' (' . count( $plan['bricks_edits'] ) . ' pól)' ) . '</summary><table class="widefat striped"><thead><tr><th>Pole</th><th>PL</th><th>EN</th></tr></thead><tbody>';
		foreach ( $plan['bricks_edits'] as $edit ) {
			echo '<tr><td>' . esc_html( $edit['element'] . '.' . $edit['path'] ) . '</td><td>' . esc_html( $edit['expected'] ) . '</td><td>' . esc_html( $edit['english'] ) . '</td></tr>';
		}
		echo '</tbody></table>';
		if ( isset( $state['existing'][ $id ] ) ) {
			echo '<p><a href="' . esc_url( get_edit_post_link( $state['existing'][ $id ] ) ) . '">Otwórz wersję EN</a></p>';
		}
		echo '</details>';
	}
	echo '<p>PDF komunikatów pozostają po polsku. Przed publikacją sprawdź warunki wyświetlania szablonów Bricks oraz wszystkie przyciski i linki.</p></div>';
}

function bemke_child_create_dynamic_templates_en_drafts() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	check_admin_referer( 'bemke_create_dynamic_templates_en_drafts' );
	$batch = bemke_child_get_dynamic_templates_batch();
	if ( is_wp_error( $batch ) ) {
		wp_die( esc_html( $batch->get_error_message() ) );
	}
	$state = bemke_child_validate_dynamic_templates_batch( $batch );
	if ( $state['errors'] || $state['orphans'] || ! $state['ready'] ) {
		wp_die( esc_html( 'Plan jest nieaktualny. Sprawdź Narzędzia → Bemke EN — szablony treści.' ) );
	}
	foreach ( $batch['plans'] as $plan ) {
		$id = (int) $plan['source_post_id'];
		if ( ! isset( $state['ready'][ $id ] ) ) {
			continue;
		}
		$elements = $state['ready'][ $id ]['elements'];
		foreach ( $plan['bricks_edits'] as $edit ) {
			bemke_child_main_pages_write_path( $elements[ $state['ready'][ $id ]['indexes'][ $edit['element'] ] ], $edit['path'], $edit['english'] );
		}
		bemke_child_chrome_remap_internal_links( $elements );
		$post_id = wp_insert_post( array( 'post_type' => 'bricks_template', 'post_status' => 'draft', 'post_title' => $plan['target_title'], 'post_content' => '', 'post_author' => get_current_user_id() ), true );
		if ( is_wp_error( $post_id ) ) {
			wp_die( esc_html( 'Import przerwany: ' . $post_id->get_error_message() ) );
		}
		update_post_meta( $post_id, '_bemke_dynamic_template_en_source_id', $id );
		pll_set_post_language( $post_id, 'en' );
		if ( 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
			wp_die( esc_html( 'Utworzono szkic, ale nie przypisano języka EN. ID: ' . $post_id ) );
		}
		update_post_meta( $post_id, '_bricks_page_content_2', wp_slash( $elements ) );
		update_post_meta( $post_id, '_bricks_template_type', $plan['source_template_type'] );
		foreach ( array( '_bricks_template_settings', '_bricks_editor_mode' ) as $key ) {
			$value = get_post_meta( $id, $key, true );
			if ( '' !== $value ) {
				update_post_meta( $post_id, $key, wp_slash( $value ) );
			}
		}
		$translations       = (array) pll_get_post_translations( $id );
		$translations['pl'] = $id;
		$translations['en'] = $post_id;
		pll_save_post_translations( $translations );
		if ( (int) pll_get_post( $id, 'en' ) !== (int) $post_id ) {
			wp_die( esc_html( 'Utworzono szkic, ale połączenie Polylang wymaga sprawdzenia. ID: ' . $post_id ) );
		}
	}
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-dynamic-templates-en&created=1' ) );
	exit;
}
