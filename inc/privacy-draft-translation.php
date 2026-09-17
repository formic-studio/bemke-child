<?php
/** One reviewed English privacy-policy draft from the September 2026 WXR. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_privacy_translation_page' );
add_action( 'admin_post_bemke_create_privacy_en_draft', 'bemke_child_create_privacy_en_draft' );

function bemke_child_register_privacy_translation_page() {
	add_management_page( 'Bemke EN — polityka prywatności', 'Bemke EN — polityka prywatności', 'manage_options', 'bemke-privacy-en', 'bemke_child_render_privacy_translation_page' );
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_privacy_translation_batch() {
	$path = get_stylesheet_directory() . '/data/privacy-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_batch', 'Brakuje planu tłumaczenia polityki prywatności.' );
	}
	$batch = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$plan  = $batch['plan'] ?? null;
	if ( ! is_array( $batch ) || 'privacy-page-1' !== ( $batch['batch'] ?? null ) || ! is_array( $plan ) || 1475 !== ( $plan['source_post_id'] ?? null ) || ! isset( $plan['source_post_title'], $plan['source_post_parent'], $plan['source_excerpt'], $plan['source_bricks_sha256'], $plan['source_bricks_elements'], $plan['source_html_sha256'], $plan['target_title'], $plan['target_slug'], $plan['target_excerpt'], $plan['target_html'], $plan['bricks_edits'], $plan['yoast_edits'] ) || ! is_array( $plan['bricks_edits'] ) || ! is_array( $plan['yoast_edits'] ) ) {
		return new WP_Error( 'invalid_batch', 'Plan tłumaczenia polityki prywatności jest nieprawidłowy.' );
	}
	return $batch;
}

/** @return array<string, mixed> */
function bemke_child_validate_privacy_translation( $batch ) {
	$state = array( 'errors' => array(), 'existing' => 0, 'orphan' => 0, 'source' => null, 'elements' => array(), 'indexes' => array() );
	foreach ( array( 'pll_get_post_language', 'pll_get_post', 'pll_get_post_translations', 'pll_set_post_language', 'pll_save_post_translations' ) as $name ) {
		if ( ! function_exists( $name ) ) {
			$state['errors'][] = 'Polylang musi być aktywny.';
			return $state;
		}
	}
	$plan    = $batch['plan'];
	$id      = (int) $plan['source_post_id'];
	$source  = get_post( $id );
	$options = get_option( 'polylang', array() );
	if ( is_array( $options ) && in_array( 'post_meta', (array) ( $options['sync'] ?? array() ), true ) ) {
		$state['errors'][] = 'Wyłącz synchronizację pól własnych w Polylang.';
	}
	if ( ! $source || 'page' !== $source->post_type || 'publish' !== $source->post_status || 'pl' !== pll_get_post_language( $id, 'slug' ) || ! current_user_can( 'edit_post', $id ) ) {
		$state['errors'][] = 'Polska strona źródłowa nie istnieje albo zmieniła typ, status, język lub uprawnienia.';
		return $state;
	}
	$state['source']   = $source;
	$state['existing'] = (int) pll_get_post( $id, 'en' );
	$orphans          = get_posts( array( 'post_type' => 'page', 'post_status' => array( 'draft', 'pending', 'private', 'publish', 'future' ), 'meta_key' => '_bemke_privacy_en_source_id', 'meta_value' => (string) $id, 'posts_per_page' => 1, 'suppress_filters' => true ) );
	$state['orphan']   = $orphans && ! $state['existing'] ? (int) $orphans[0]->ID : 0;
	if ( $source->post_title !== $plan['source_post_title'] || (int) $source->post_parent !== (int) $plan['source_post_parent'] || $source->post_excerpt !== $plan['source_excerpt'] ) {
		$state['errors'][] = 'Tytuł, rodzic lub opis polskiej strony zmienił się od eksportu.';
	}
	$elements = get_post_meta( $id, '_bricks_page_content_2', true );
	if ( ! is_array( $elements ) || count( $elements ) !== (int) $plan['source_bricks_elements'] || ! hash_equals( $plan['source_bricks_sha256'], hash( 'sha256', serialize( $elements ) ) ) ) {
		$state['errors'][] = 'Układ Bricks polskiej strony zmienił się od eksportu.';
		return $state;
	}
	$state['elements'] = $elements;
	foreach ( $elements as $index => $element ) {
		if ( isset( $element['id'] ) ) {
			$state['indexes'][ $element['id'] ] = $index;
		}
	}
	$html_index = $state['indexes']['olncec'] ?? null;
	$html       = null !== $html_index ? bemke_child_main_pages_read_path( $elements[ $html_index ], 'settings.text' ) : null;
	if ( ! is_string( $html ) || ! hash_equals( $plan['source_html_sha256'], hash( 'sha256', $html ) ) ) {
		$state['errors'][] = 'Treść polityki prywatności zmieniła się od eksportu.';
	}
	foreach ( $plan['bricks_edits'] as $edit ) {
		$index = $state['indexes'][ $edit['element'] ?? '' ] ?? null;
		if ( null === $index || ! isset( $edit['path'], $edit['expected'], $edit['english'] ) || bemke_child_main_pages_read_path( $elements[ $index ], $edit['path'] ) !== $edit['expected'] ) {
			$state['errors'][] = 'Nagłówek Bricks zmienił się od eksportu.';
		}
	}
	foreach ( $plan['yoast_edits'] as $edit ) {
		if ( ! isset( $edit['key'], $edit['expected'], $edit['english'] ) || (string) get_post_meta( $id, $edit['key'], true ) !== $edit['expected'] ) {
			$state['errors'][] = 'Dane Yoast zmieniły się od eksportu.';
		}
	}
	return $state;
}

function bemke_child_render_privacy_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$batch = bemke_child_get_privacy_translation_batch();
	echo '<div class="wrap"><h1>Bemke EN — polityka prywatności</h1>';
	if ( is_wp_error( $batch ) ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $batch->get_error_message() ) . '</p></div></div>';
		return;
	}
	$state = bemke_child_validate_privacy_translation( $batch );
	if ( isset( $_GET['created'] ) ) {
		echo '<div class="notice notice-success"><p>Utworzono szkic polityki prywatności EN.</p></div>';
	}
	foreach ( $state['errors'] as $error ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $error ) . '</p></div>';
	}
	echo '<p>Plan obejmuje ' . esc_html( (string) $batch['translated_blocks'] ) . ' bloków tekstu, nagłówki Bricks i dane Yoast. Polska strona pozostaje bez zmian.</p>';
	if ( $state['existing'] ) {
		echo '<p>Wersja EN: <a href="' . esc_url( get_edit_post_link( $state['existing'] ) ) . '">' . esc_html( (string) $state['existing'] ) . '</a>.</p>';
	} elseif ( $state['orphan'] ) {
		echo '<div class="notice notice-warning"><p>Istnieje szkic bez powiązania Polylang: ' . esc_html( (string) $state['orphan'] ) . '. Sprawdź go przed ponowieniem importu.</p></div>';
	} elseif ( ! $state['errors'] ) {
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="bemke_create_privacy_en_draft">';
		wp_nonce_field( 'bemke_create_privacy_en_draft' );
		submit_button( 'Utwórz szkic polityki prywatności EN' );
		echo '</form>';
	}
	echo '<p><strong>Przed publikacją:</strong> wymagana jest kontrola merytoryczna i prawna całej treści, adresów e-mail oraz odnośników do dostawców usług. Szkic nie zmienia ustawienia strony prywatności w WordPressie.</p></div>';
}

function bemke_child_create_privacy_en_draft() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	check_admin_referer( 'bemke_create_privacy_en_draft' );
	$batch = bemke_child_get_privacy_translation_batch();
	if ( is_wp_error( $batch ) ) {
		wp_die( esc_html( $batch->get_error_message() ) );
	}
	$state = bemke_child_validate_privacy_translation( $batch );
	if ( $state['errors'] || $state['existing'] || $state['orphan'] ) {
		wp_die( esc_html( 'Plan jest nieaktualny albo szkic EN już istnieje. Sprawdź Narzędzia → Bemke EN — polityka prywatności.' ) );
	}
	$plan     = $batch['plan'];
	$elements = $state['elements'];
	bemke_child_main_pages_write_path( $elements[ $state['indexes']['olncec'] ], 'settings.text', $plan['target_html'] );
	foreach ( $plan['bricks_edits'] as $edit ) {
		bemke_child_main_pages_write_path( $elements[ $state['indexes'][ $edit['element'] ] ], $edit['path'], $edit['english'] );
	}
	$post_id = wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'draft', 'post_title' => $plan['target_title'], 'post_name' => $plan['target_slug'], 'post_excerpt' => $plan['target_excerpt'], 'post_author' => get_current_user_id(), 'menu_order' => $state['source']->menu_order ), true );
	if ( is_wp_error( $post_id ) ) {
		wp_die( esc_html( $post_id->get_error_message() ) );
	}
	update_post_meta( $post_id, '_bemke_privacy_en_source_id', 1475 );
	pll_set_post_language( $post_id, 'en' );
	if ( 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
		wp_die( esc_html( 'Utworzono szkic, ale nie przypisano języka EN. ID: ' . $post_id ) );
	}
	update_post_meta( $post_id, '_bricks_page_content_2', wp_slash( $elements ) );
	foreach ( array( '_bricks_editor_mode', '_bricks_template_type', '_thumbnail_id' ) as $key ) {
		$value = get_post_meta( 1475, $key, true );
		if ( '' !== $value ) {
			update_post_meta( $post_id, $key, wp_slash( $value ) );
		}
	}
	foreach ( $plan['yoast_edits'] as $edit ) {
		update_post_meta( $post_id, $edit['key'], wp_slash( $edit['english'] ) );
	}
	$translations       = (array) pll_get_post_translations( 1475 );
	$translations['pl'] = 1475;
	$translations['en'] = $post_id;
	pll_save_post_translations( $translations );
	if ( (int) pll_get_post( 1475, 'en' ) !== (int) $post_id ) {
		wp_die( esc_html( 'Utworzono szkic, ale połączenie Polylang wymaga sprawdzenia. ID: ' . $post_id ) );
	}
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-privacy-en&created=1' ) );
	exit;
}
