<?php
/** Draft translations for Strategy 2050, donors and Campus document labels. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_cpt_content_translation_page' );
add_action( 'admin_post_bemke_create_cpt_content_en_drafts', 'bemke_child_create_cpt_content_en_drafts' );

function bemke_child_register_cpt_content_translation_page() {
	add_management_page( 'Bemke EN — treści dodatkowe', 'Bemke EN — treści dodatkowe', 'manage_options', 'bemke-cpt-content-en', 'bemke_child_render_cpt_content_translation_page' );
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_cpt_content_batch() {
	$path = get_stylesheet_directory() . '/data/cpt-content-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_batch', 'Brakuje planu treści dodatkowych.' );
	}
	$batch      = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$extra_path = get_stylesheet_directory() . '/data/news-jobs-bemke-en.json';
	$extra      = is_readable( $extra_path ) ? json_decode( file_get_contents( $extra_path ), true ) : null; // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ! is_array( $extra ) || 'news-jobs-1' !== ( $extra['batch'] ?? null ) || ! isset( $extra['plans'] ) || ! is_array( $extra['plans'] ) || count( $extra['plans'] ) !== 5 ) {
		return new WP_Error( 'invalid_batch', 'Brakuje planu ofert pracy i komunikatów prasowych.' );
	}
	$counts = array( 'strategia-2050' => 7, 'darczynca' => 16, 'pdf' => 6, 'dokumenty-fundacja' => 1, 'oferta-pracy' => 3, 'komunikat-prasowy' => 2 );
	if ( ! is_array( $batch ) || 'cpt-content-1' !== ( $batch['batch'] ?? null ) || ! isset( $batch['plans'] ) || ! is_array( $batch['plans'] ) || count( $batch['plans'] ) !== 30 ) {
		return new WP_Error( 'invalid_batch', 'Plan treści dodatkowych ma nieprawidłowy format.' );
	}
	$batch['plans'] = array_merge( $batch['plans'], $extra['plans'] );
	$seen = array();
	foreach ( $batch['plans'] as $plan ) {
		$type = $plan['source_post_type'] ?? '';
		$id   = $plan['source_post_id'] ?? null;
		if ( ! isset( $counts[ $type ] ) || ! is_int( $id ) || isset( $seen[ $id ] ) || ! isset( $plan['source_post_status'], $plan['source_post_title'], $plan['source_post_parent'], $plan['target_title'], $plan['target_slug'], $plan['target_excerpt'], $plan['meta_edits'] ) || ! is_array( $plan['meta_edits'] ) ) {
			return new WP_Error( 'invalid_batch', 'W planie znajduje się nieprawidłowy wpis.' );
		}
		$seen[ $id ] = true;
		--$counts[ $type ];
	}
	if ( array_filter( $counts ) ) {
		return new WP_Error( 'invalid_batch', 'Plan ma nieprawidłową liczbę wpisów.' );
	}
	return $batch;
}

/** @return array<string, mixed> */
function bemke_child_validate_cpt_content_group( $batch, $type ) {
	$state = array( 'errors' => array(), 'ready' => array(), 'existing' => array(), 'orphans' => array() );
	foreach ( array( 'pll_get_post_language', 'pll_get_post', 'pll_get_post_translations', 'pll_set_post_language', 'pll_save_post_translations' ) as $name ) {
		if ( ! function_exists( $name ) ) {
			$state['errors'][] = 'Polylang musi być aktywny.';
			return $state;
		}
	}
	if ( function_exists( 'pll_is_translated_post_type' ) && ! pll_is_translated_post_type( $type ) ) {
		$state['errors'][] = 'Włącz typ „' . $type . '” w Języki → Ustawienia → Custom post types and Taxonomies.';
		return $state;
	}
	$options = get_option( 'polylang', array() );
	if ( is_array( $options ) && in_array( 'post_meta', (array) ( $options['sync'] ?? array() ), true ) ) {
		$state['errors'][] = 'Wyłącz synchronizację pól własnych w Polylang.';
	}
	foreach ( $batch['plans'] as $plan ) {
		if ( $type !== $plan['source_post_type'] ) {
			continue;
		}
		$id     = (int) $plan['source_post_id'];
		$source = get_post( $id );
		if ( ! $source || $source->post_type !== $type || 'publish' !== $source->post_status || 'pl' !== pll_get_post_language( $id, 'slug' ) || ! current_user_can( 'edit_post', $id ) || $source->post_title !== $plan['source_post_title'] || (int) $source->post_parent !== (int) $plan['source_post_parent'] ) {
			$state['errors'][] = 'Wpis PL ' . $id . ' zmienił się od eksportu albo nie jest przypisany do PL.';
			continue;
		}
		$existing = (int) pll_get_post( $id, 'en' );
		$orphans  = get_posts( array( 'post_type' => $type, 'post_status' => array( 'draft', 'pending', 'private', 'publish', 'future' ), 'meta_key' => '_bemke_cpt_content_en_source_id', 'meta_value' => (string) $id, 'posts_per_page' => 1, 'suppress_filters' => true ) );
		if ( $existing ) {
			$state['existing'][ $id ] = $existing;
			continue;
		}
		if ( $orphans ) {
			$state['orphans'][ $id ] = (int) $orphans[0]->ID;
			continue;
		}
		foreach ( $plan['meta_edits'] as $edit ) {
			if ( ! isset( $edit['key'], $edit['expected'], $edit['english'] ) || (string) get_post_meta( $id, $edit['key'], true ) !== $edit['expected'] ) {
				$state['errors'][] = 'Pole ' . ( $edit['key'] ?? 'nieznane' ) . ' wpisu PL ' . $id . ' zmieniło się od eksportu.';
			}
		}
		if ( isset( $plan['link_edit'] ) ) {
			$link = get_post_meta( $id, 'link', true );
			if ( ! is_array( $link ) || ( $link['title'] ?? null ) !== $plan['link_edit']['expected_title'] || ( $link['url'] ?? null ) !== $plan['link_edit']['expected_url'] ) {
				$state['errors'][] = 'Pole link wpisu PL ' . $id . ' zmieniło się od eksportu.';
			}
		}
		$state['ready'][ $id ] = $source;
	}
	return $state;
}

function bemke_child_render_cpt_content_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$batch = bemke_child_get_cpt_content_batch();
	echo '<div class="wrap"><h1>Bemke EN — pozostałe treści</h1>';
	if ( is_wp_error( $batch ) ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $batch->get_error_message() ) . '</p></div></div>';
		return;
	}
	if ( isset( $_GET['created'] ) ) {
		echo '<div class="notice notice-success"><p>Utworzono szkice EN dla wybranej grupy.</p></div>';
	}
	echo '<p>Każdą grupę można importować osobno. Narzędzie tworzy wyłącznie szkice i zachowuje polskie strony. Dokumenty w EN mają angielskie nazwy, ale pobierany PDF nadal jest po polsku.</p>';
	foreach ( array( 'strategia-2050' => 'Strategia 2050', 'darczynca' => 'Darczyńcy', 'pdf' => 'Dokumenty Campus Bemke', 'dokumenty-fundacja' => 'Dokumenty Fundacji Bemke', 'oferta-pracy' => 'Oferty pracy', 'komunikat-prasowy' => 'Komunikaty prasowe' ) as $type => $label ) {
		$state = bemke_child_validate_cpt_content_group( $batch, $type );
		echo '<h2>' . esc_html( $label ) . '</h2>';
		foreach ( $state['errors'] as $error ) {
			echo '<div class="notice notice-error"><p>' . esc_html( $error ) . '</p></div>';
		}
		foreach ( $state['orphans'] as $id => $orphan ) {
			echo '<div class="notice notice-warning"><p>' . esc_html( 'Wpis ' . $id . ' ma szkic bez połączenia Polylang: ' . $orphan . '.' ) . '</p></div>';
		}
		echo '<p>Do utworzenia: ' . esc_html( (string) count( $state['ready'] ) ) . ', powiązane EN: ' . esc_html( (string) count( $state['existing'] ) ) . '.</p>';
		if ( ! $state['errors'] && ! $state['orphans'] && $state['ready'] ) {
			echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="bemke_create_cpt_content_en_drafts"><input type="hidden" name="group" value="' . esc_attr( $type ) . '">';
			wp_nonce_field( 'bemke_create_cpt_content_en_drafts_' . $type );
			submit_button( 'Utwórz ' . count( $state['ready'] ) . ' szkiców EN — ' . $label );
			echo '</form>';
		}
		foreach ( $batch['plans'] as $plan ) {
			if ( $type !== $plan['source_post_type'] ) {
				continue;
			}
			$id = (int) $plan['source_post_id'];
			echo '<details><summary>' . esc_html( $plan['source_post_title'] . ' → ' . $plan['target_title'] ) . '</summary><table class="widefat striped"><thead><tr><th>Pole</th><th>PL</th><th>EN</th></tr></thead><tbody>';
			foreach ( $plan['meta_edits'] as $edit ) {
				echo '<tr><td>' . esc_html( $edit['key'] ) . '</td><td>' . esc_html( $edit['expected'] ) . '</td><td>' . esc_html( $edit['english'] ) . '</td></tr>';
			}
			echo '</tbody></table>';
			if ( isset( $state['existing'][ $id ] ) ) {
				echo '<p><a href="' . esc_url( get_edit_post_link( $state['existing'][ $id ] ) ) . '">Otwórz wersję EN</a></p>';
			}
			echo '</details>';
		}
	}
	echo '<p>Przed publikacją sprawdź karty, formularze i linki. Dwie oferty pracy mają w źródle odnośnik „Poznaj szczegóły” prowadzący do youtube.com; pozostaje ten sam adres i wymaga weryfikacji. Angielskie ALT obrazów będą uzupełniane w osobnym etapie.</p></div>';
}

function bemke_child_create_cpt_content_en_drafts() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$type = isset( $_POST['group'] ) ? sanitize_key( wp_unslash( $_POST['group'] ) ) : '';
	if ( ! in_array( $type, array( 'strategia-2050', 'darczynca', 'pdf', 'dokumenty-fundacja', 'oferta-pracy', 'komunikat-prasowy' ), true ) ) {
		wp_die( esc_html( 'Nieznana grupa.' ) );
	}
	check_admin_referer( 'bemke_create_cpt_content_en_drafts_' . $type );
	$batch = bemke_child_get_cpt_content_batch();
	if ( is_wp_error( $batch ) ) {
		wp_die( esc_html( $batch->get_error_message() ) );
	}
	$state = bemke_child_validate_cpt_content_group( $batch, $type );
	if ( $state['errors'] || $state['orphans'] || ! $state['ready'] ) {
		wp_die( esc_html( 'Plan jest nieaktualny. Sprawdź Narzędzia → Bemke EN — treści dodatkowe.' ) );
	}
	foreach ( $batch['plans'] as $plan ) {
		$id = (int) $plan['source_post_id'];
		if ( $type !== $plan['source_post_type'] || ! isset( $state['ready'][ $id ] ) ) {
			continue;
		}
		$source  = $state['ready'][ $id ];
		$post_id = wp_insert_post( array( 'post_type' => $type, 'post_status' => 'draft', 'post_title' => $plan['target_title'], 'post_name' => $plan['target_slug'], 'post_excerpt' => $plan['target_excerpt'], 'post_content' => $source->post_content, 'post_author' => get_current_user_id(), 'menu_order' => $source->menu_order ), true );
		if ( is_wp_error( $post_id ) ) {
			wp_die( esc_html( 'Import przerwany: ' . $post_id->get_error_message() ) );
		}
		update_post_meta( $post_id, '_bemke_cpt_content_en_source_id', $id );
		pll_set_post_language( $post_id, 'en' );
		if ( 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
			wp_die( esc_html( 'Utworzono szkic, ale nie przypisano języka EN. ID: ' . $post_id ) );
		}
		$edited_keys = array_column( $plan['meta_edits'], 'key' );
		foreach ( get_post_meta( $id ) as $key => $values ) {
			if ( in_array( $key, $edited_keys, true ) || preg_match( '/^(_edit|_pll_|_yoast_wpseo|_wp_old_slug)/', $key ) ) {
				continue;
			}
			foreach ( $values as $value ) {
				add_post_meta( $post_id, $key, wp_slash( maybe_unserialize( $value ) ) );
			}
		}
		foreach ( $plan['meta_edits'] as $edit ) {
			update_post_meta( $post_id, $edit['key'], wp_slash( $edit['english'] ) );
		}
		if ( isset( $plan['link_edit'] ) ) {
			$link          = get_post_meta( $post_id, 'link', true );
			$link['title'] = $plan['link_edit']['english_title'];
			update_post_meta( $post_id, 'link', wp_slash( $link ) );
		}
		update_post_meta( $post_id, '_yoast_wpseo_title', $plan['target_title'] . ' – Bemke' );
		update_post_meta( $post_id, '_yoast_wpseo_metadesc', wp_slash( $plan['target_excerpt'] ) );
		$translations       = (array) pll_get_post_translations( $id );
		$translations['pl'] = $id;
		$translations['en'] = $post_id;
		pll_save_post_translations( $translations );
		if ( (int) pll_get_post( $id, 'en' ) !== (int) $post_id ) {
			wp_die( esc_html( 'Utworzono szkic, ale połączenie Polylang wymaga sprawdzenia. ID: ' . $post_id ) );
		}
	}
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-cpt-content-en&created=1' ) );
	exit;
}
