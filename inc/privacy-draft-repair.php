<?php
/** Repair the existing English privacy-policy draft without creating a new page. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_privacy_draft_repair' );
add_action( 'admin_post_bemke_repair_privacy_en_draft', 'bemke_child_apply_privacy_draft_repair' );

function bemke_child_register_privacy_draft_repair() {
	add_management_page(
		'Bemke EN — naprawa polityki prywatności',
		'Bemke EN — naprawa polityki',
		'manage_options',
		'bemke-privacy-en-repair',
		'bemke_child_render_privacy_draft_repair'
	);
}

/** @return array<string, mixed> */
function bemke_child_privacy_draft_repair_state() {
	$state = array( 'errors' => array(), 'changes' => array() );
	$path  = get_stylesheet_directory() . '/data/privacy-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		$state['errors'][] = 'Brakuje planu tłumaczenia.';
		return $state;
	}
	$batch = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$plan  = is_array( $batch ) ? ( $batch['plan'] ?? null ) : null;
	if ( ! is_array( $plan ) || 'privacy-page-1' !== ( $batch['batch'] ?? '' ) || 1475 !== ( $plan['source_post_id'] ?? 0 ) || ! isset( $plan['target_html'], $plan['source_html_sha256'], $plan['bricks_edits'], $plan['yoast_edits'] ) ) {
		$state['errors'][] = 'Plan tłumaczenia ma nieprawidłowy format.';
		return $state;
	}
	if ( ! function_exists( 'pll_get_post_language' ) || ! function_exists( 'pll_get_post' ) ) {
		$state['errors'][] = 'Polylang nie jest aktywny.';
		return $state;
	}
	$polylang_options = get_option( 'polylang', array() );
	if ( is_array( $polylang_options ) && in_array( 'post_meta', (array) ( $polylang_options['sync'] ?? array() ), true ) ) {
		$state['errors'][] = 'Wyłącz synchronizację pól własnych w Polylang, aby nie nadpisać strony PL.';
	}
	$source = get_post( 1475 );
	$target = get_post( 4653 );
	if ( ! $source || 'page' !== $source->post_type || 'publish' !== $source->post_status || 'pl' !== pll_get_post_language( 1475, 'slug' ) ) {
		$state['errors'][] = 'Polska strona źródłowa ID 1475 nie jest opublikowaną stroną PL.';
	}
	if ( ! $target || 'page' !== $target->post_type || 'draft' !== $target->post_status || 'en' !== pll_get_post_language( 4653, 'slug' ) || ! current_user_can( 'edit_post', 4653 ) ) {
		$state['errors'][] = 'Strona ID 4653 nie jest dostępnym szkicem EN.';
	}
	if ( $source && $target && 4653 !== (int) pll_get_post( 1475, 'en' ) ) {
		$state['errors'][] = 'Szkic ID 4653 nie jest powiązany w Polylang ze stroną PL ID 1475.';
	}
	if ( $state['errors'] ) {
		return $state;
	}

	$source_elements = get_post_meta( 1475, '_bricks_page_content_2', true );
	$target_elements = get_post_meta( 4653, '_bricks_page_content_2', true );
	if ( ! is_array( $source_elements ) || ! is_array( $target_elements ) ) {
		$state['errors'][] = 'Brakuje danych Bricks strony PL lub szkicu EN.';
		return $state;
	}
	$source_by_id = array();
	$target_by_id = array();
	foreach ( $source_elements as $element ) {
		if ( isset( $element['id'] ) ) {
			$source_by_id[ $element['id'] ] = $element;
		}
	}
	foreach ( $target_elements as $index => $element ) {
		if ( isset( $element['id'] ) ) {
			$target_by_id[ $element['id'] ] = $index;
		}
	}
	$source_html = $source_by_id['olncec']['settings']['text'] ?? null;
	$target_index = $target_by_id['olncec'] ?? null;
	$target_html = null !== $target_index ? ( $target_elements[ $target_index ]['settings']['text'] ?? null ) : null;
	if ( ! is_string( $source_html ) || ! hash_equals( $plan['source_html_sha256'], hash( 'sha256', $source_html ) ) ) {
		$state['errors'][] = 'Polska treść polityki zmieniła się od eksportu. Wymaga nowego planu.';
	}
	if ( ! is_string( $target_html ) || ( $target_html !== $source_html && $target_html !== $plan['target_html'] ) ) {
		$state['errors'][] = 'Treść szkicu EN została już zmieniona. Nie nadpisuję jej automatycznie.';
	}
	if ( count( $source_elements ) !== count( $target_elements ) ) {
		$state['errors'][] = 'Układ Bricks szkicu EN różni się od układu strony PL.';
	}
	foreach ( $plan['bricks_edits'] as $edit ) {
		$id = $edit['element'] ?? '';
		$index = $target_by_id[ $id ] ?? null;
		$current = null !== $index ? ( $target_elements[ $index ]['settings']['text'] ?? null ) : null;
		if ( ! is_string( $current ) || ( $current !== $edit['expected'] && $current !== $edit['english'] ) ) {
			$state['errors'][] = 'Nagłówek lub etykieta Bricks ' . $id . ' różni się od planu.';
		}
	}
	foreach ( array( 'post_title' => 'target_title', 'post_excerpt' => 'target_excerpt' ) as $field => $key ) {
		$current = $target->$field;
		if ( $current !== $source->$field && $current !== $plan[ $key ] ) {
			$state['errors'][] = 'Pole ' . $field . ' szkicu EN różni się od planu.';
		}
	}
	foreach ( $plan['yoast_edits'] as $edit ) {
		$current = (string) get_post_meta( 4653, $edit['key'], true );
		if ( '' !== $current && $current !== $edit['expected'] && $current !== $edit['english'] ) {
			$state['errors'][] = 'Pole Yoast ' . $edit['key'] . ' szkicu EN różni się od planu.';
		}
	}
	if ( $state['errors'] ) {
		return $state;
	}
	if ( $target_html !== $plan['target_html'] ) {
		$state['changes'][] = 'pełna treść polityki w Bricks';
	}
	foreach ( $plan['bricks_edits'] as $edit ) {
		if ( $target_elements[ $target_by_id[ $edit['element'] ] ]['settings']['text'] !== $edit['english'] ) {
			$state['changes'][] = 'nagłówek Bricks ' . $edit['element'];
		}
	}
	if ( $target->post_title !== $plan['target_title'] || $target->post_name !== $plan['target_slug'] || $target->post_excerpt !== $plan['target_excerpt'] ) {
		$state['changes'][] = 'tytuł, adres lub opis strony';
	}
	foreach ( $plan['yoast_edits'] as $edit ) {
		if ( (string) get_post_meta( 4653, $edit['key'], true ) !== $edit['english'] ) {
			$state['changes'][] = 'dane Yoast';
			break;
		}
	}
	$state['plan'] = $plan;
	$state['elements'] = $target_elements;
	$state['indexes'] = $target_by_id;
	return $state;
}

function bemke_child_render_privacy_draft_repair() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$state = bemke_child_privacy_draft_repair_state();
	echo '<div class="wrap"><h1>Naprawa szkicu polityki prywatności EN</h1>';
	if ( isset( $_GET['applied'] ) ) {
		echo '<div class="notice notice-success"><p>Przetłumaczono istniejący szkic ID 4653.</p></div>';
	}
	foreach ( $state['errors'] as $error ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $error ) . '</p></div>';
	}
	if ( ! $state['errors'] ) {
		if ( $state['changes'] ) {
			echo '<p>Do zmiany: ' . esc_html( implode( ', ', array_unique( $state['changes'] ) ) ) . '. Polski oryginał i status „Szkic” pozostaną bez zmian.</p>';
			echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="bemke_repair_privacy_en_draft">';
			wp_nonce_field( 'bemke_repair_privacy_en_draft' );
			submit_button( 'Przetłumacz szkic ID 4653' );
			echo '</form>';
		} else {
			echo '<p>Szkic ID 4653 ma już zapisane angielskie pola z planu.</p>';
		}
	}
	echo '<p>Po zapisaniu sprawdź podgląd całej strony oraz adresy e-mail i linki. Przed publikacją polityka wymaga przeglądu prawnego.</p></div>';
}

function bemke_child_apply_privacy_draft_repair() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	check_admin_referer( 'bemke_repair_privacy_en_draft' );
	$state = bemke_child_privacy_draft_repair_state();
	if ( $state['errors'] ) {
		wp_die( esc_html( implode( ' ', $state['errors'] ) ) );
	}
	if ( ! $state['changes'] ) {
		wp_safe_redirect( admin_url( 'tools.php?page=bemke-privacy-en-repair' ) );
		exit;
	}
	$plan = $state['plan'];
	$elements = $state['elements'];
	$elements[ $state['indexes']['olncec'] ]['settings']['text'] = $plan['target_html'];
	foreach ( $plan['bricks_edits'] as $edit ) {
		$elements[ $state['indexes'][ $edit['element'] ] ]['settings']['text'] = $edit['english'];
	}
	$post_result = wp_update_post( array(
		'ID' => 4653,
		'post_title' => $plan['target_title'],
		'post_name' => $plan['target_slug'],
		'post_excerpt' => $plan['target_excerpt'],
	), true );
	if ( is_wp_error( $post_result ) ) {
		wp_die( esc_html( $post_result->get_error_message() ) );
	}
	update_post_meta( 4653, '_bricks_page_content_2', wp_slash( $elements ) );
	foreach ( $plan['yoast_edits'] as $edit ) {
		update_post_meta( 4653, $edit['key'], wp_slash( $edit['english'] ) );
	}
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-privacy-en-repair&applied=1' ) );
	exit;
}
