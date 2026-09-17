<?php
/** English navigation and footer drafts for the staged Polylang rollout. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_chrome_translation_page' );
add_action( 'admin_post_bemke_create_chrome_en_drafts', 'bemke_child_create_chrome_en_drafts' );

function bemke_child_register_chrome_translation_page() {
	add_management_page( 'Bemke EN — nawigacja i stopka', 'Bemke EN — nawigacja', 'manage_options', 'bemke-chrome-translation', 'bemke_child_render_chrome_translation_page' );
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_chrome_translation_batch() {
	$path = get_stylesheet_directory() . '/data/chrome-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_batch', 'Brakuje planu nagłówka i stopki EN.' );
	}
	$batch = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ! is_array( $batch ) || 'chrome-en-2' !== ( $batch['batch'] ?? '' ) || 3 !== ( $batch['source_menu_id'] ?? null ) || 2 !== count( $batch['templates'] ?? array() ) || 22 !== count( $batch['menu_items'] ?? array() ) ) {
		return new WP_Error( 'invalid_batch', 'Plan nagłówka, stopki lub menu ma nieprawidłowy format.' );
	}
	return $batch;
}

/** Normalize spaces that WordPress may change when storing navigation labels. */
function bemke_child_chrome_normalize_title( $value ) {
	$value = preg_replace( '/[\x{2028}\x{2029}\s]+/u', ' ', (string) $value );
	return trim( null === $value ? '' : $value );
}

/** @return array<string, mixed> */
function bemke_child_validate_chrome_translation( $batch ) {
	$state = array( 'errors' => array(), 'templates' => array(), 'existing' => array(), 'menu' => null, 'ready' => array(), 'missing' => array() );
	foreach ( array( 'pll_get_post_language', 'pll_get_post', 'pll_get_post_translations', 'pll_set_post_language', 'pll_save_post_translations', 'pll_get_term_language', 'pll_set_term_language', 'pll_get_term_translations', 'pll_save_term_translations' ) as $name ) {
		if ( ! function_exists( $name ) ) {
			$state['errors'][] = 'Polylang musi być aktywny i obsługiwać tłumaczenie menu.';
			return $state;
		}
	}
	$options = get_option( 'polylang', array() );
	if ( is_array( $options ) && in_array( 'post_meta', (array) ( $options['sync'] ?? array() ), true ) ) {
		$state['errors'][] = 'Wyłącz synchronizację pól własnych w Polylang.';
	}
	$source_menu = wp_get_nav_menu_object( (int) $batch['source_menu_id'] );
	if ( ! $source_menu || is_wp_error( $source_menu ) ) {
		$state['errors'][] = 'Nie znaleziono polskiego menu o ID 3.';
		return $state;
	}
	$source_menu_language = pll_get_term_language( $source_menu->term_id, 'slug' );
	if ( $source_menu_language && 'pl' !== $source_menu_language ) {
		$state['errors'][] = 'Menu źródłowe ID 3 ma język inny niż polski.';
	}
	$source_items = wp_get_nav_menu_items( $source_menu->term_id, array( 'post_status' => 'publish' ) );
	$source_items = is_array( $source_items ) ? $source_items : array();
	$indexed      = array();
	foreach ( $source_items as $item ) {
		$indexed[ $item->ID ] = $item;
	}
	if ( count( $indexed ) !== count( $batch['menu_items'] ) ) {
		$state['errors'][] = 'Polskie menu zmieniło liczbę pozycji od eksportu.';
	}
	foreach ( $batch['menu_items'] as $plan ) {
		$id   = (int) ( $plan['source_item_id'] ?? 0 );
		$item = $indexed[ $id ] ?? null;
		if ( ! $item || (int) $item->menu_item_parent !== (int) $plan['source_parent_id'] || bemke_child_chrome_normalize_title( $item->title ) !== bemke_child_chrome_normalize_title( $plan['source_title'] ) || ( 'post_type' === $item->type && (int) $item->object_id !== (int) $plan['source_page_id'] ) ) {
			$state['errors'][] = 'Pozycja menu PL ' . $id . ' zmieniła się od eksportu.';
			continue;
		}
		$source_page_id = (int) $plan['source_page_id'];
		$en_page_id     = (int) pll_get_post( $source_page_id, 'en' );
		if ( $en_page_id && 'en' === pll_get_post_language( $en_page_id, 'slug' ) ) {
			$state['ready'][ $id ] = $en_page_id;
		} else {
			$state['missing'][ $id ] = $plan['target_title'];
		}
	}
	$existing_menu = wp_get_nav_menu_object( $batch['target_menu_name'] );
	$linked_menus  = (array) pll_get_term_translations( $source_menu->term_id );
	$linked_en     = (int) ( $linked_menus['en'] ?? 0 );
	if ( $linked_en && ( ! $existing_menu || is_wp_error( $existing_menu ) || (int) $existing_menu->term_id !== $linked_en ) ) {
		$state['errors'][] = 'Polskie menu jest już połączone z innym menu EN. Sprawdź je przed importem.';
	}
	if ( $existing_menu && ! is_wp_error( $existing_menu ) ) {
		if ( (int) get_term_meta( $existing_menu->term_id, '_bemke_en_source_menu_id', true ) !== $source_menu->term_id && $linked_en !== (int) $existing_menu->term_id ) {
			$state['errors'][] = 'Menu o nazwie Bemke Navigation EN już istnieje, lecz nie pochodzi z tego importu.';
		} else {
			$state['menu'] = $existing_menu;
		}
	}
	foreach ( $batch['templates'] as $plan ) {
		$id     = (int) ( $plan['source_post_id'] ?? 0 );
		$source = get_post( $id );
		if ( ! $source || 'bricks_template' !== $source->post_type || 'publish' !== $source->post_status || $source->post_title !== ( $plan['source_post_title'] ?? '' ) || 'pl' !== pll_get_post_language( $id, 'slug' ) || ! current_user_can( 'edit_post', $id ) ) {
			$state['errors'][] = 'Szablon PL ' . $id . ' nie odpowiada planowi.';
			continue;
		}
		$type     = get_post_meta( $id, '_bricks_template_type', true );
		$settings = get_post_meta( $id, '_bricks_template_settings', true );
		$elements = get_post_meta( $id, $plan['source_meta_key'], true );
		if ( $type !== $plan['source_template_type'] || ! is_array( $elements ) || count( $elements ) !== (int) $plan['source_bricks_elements'] || ! hash_equals( $plan['source_bricks_sha256'], hash( 'sha256', serialize( $elements ) ) ) || ! hash_equals( $plan['source_template_settings_sha256'], hash( 'sha256', serialize( $settings ) ) ) ) {
			$state['errors'][] = 'Układ lub warunki szablonu ' . $id . ' zmieniły się od eksportu.';
			continue;
		}
		$indexes = array();
		foreach ( $elements as $index => $element ) {
			if ( isset( $element['id'] ) ) {
				$indexes[ $element['id'] ] = $index;
			}
		}
		foreach ( $plan['bricks_edits'] as $edit ) {
			$current = isset( $indexes[ $edit['element'] ] ) ? bemke_child_main_pages_read_path( $elements[ $indexes[ $edit['element'] ] ], $edit['path'] ) : null;
			if ( $current !== $edit['expected'] ) {
				$state['errors'][] = 'Pole szablonu ' . $id . ': ' . $edit['element'] . '.' . $edit['path'] . ' zmieniło się.';
			}
		}
		$state['templates'][ $id ] = array( 'elements' => $elements, 'settings' => $settings, 'indexes' => $indexes );
		$existing                  = (int) pll_get_post( $id, 'en' );
		if ( $existing ) {
			$state['existing'][ $id ] = $existing;
		} else {
			$orphans = get_posts( array( 'post_type' => 'bricks_template', 'post_status' => array( 'draft', 'publish', 'private' ), 'meta_key' => '_bemke_chrome_en_source_id', 'meta_value' => (string) $id, 'posts_per_page' => 1, 'suppress_filters' => true ) );
			if ( $orphans ) {
				$state['errors'][] = 'Szablon ' . $id . ' ma szkic EN bez powiązania Polylang: ' . $orphans[0]->ID . '.';
			}
		}
	}
	return $state;
}

function bemke_child_render_chrome_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$batch = bemke_child_get_chrome_translation_batch();
	echo '<div class="wrap"><h1>Bemke EN — nawigacja i stopka</h1>';
	if ( is_wp_error( $batch ) ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $batch->get_error_message() ) . '</p></div></div>';
		return;
	}
	$state = bemke_child_validate_chrome_translation( $batch );
	if ( isset( $_GET['created'] ) ) {
		echo '<div class="notice notice-success"><p>Menu EN i szkice szablonów zostały przygotowane. Pozostają nieopublikowane.</p></div>';
	}
	if ( $state['errors'] ) {
		echo '<div class="notice notice-error"><p>Import wstrzymany:</p><ul>';
		foreach ( $state['errors'] as $error ) {
			echo '<li>' . esc_html( $error ) . '</li>';
		}
		echo '</ul></div>';
	}
	echo '<p>Angielskie menu ma obecnie ' . esc_html( (string) count( $state['ready'] ) ) . ' gotowych pozycji z ' . esc_html( (string) count( $batch['menu_items'] ) ) . '. Pozostałe pojawią się po przygotowaniu odpowiadających im stron EN i ponownym uruchomieniu synchronizacji.</p>';
	if ( $state['missing'] ) {
		echo '<p>Oczekujące pozycje: ' . esc_html( implode( ', ', array_values( $state['missing'] ) ) ) . '.</p>';
	}
	echo '<table class="widefat striped"><thead><tr><th>Szablon PL</th><th>Szablon EN</th><th>Pola tłumaczenia</th></tr></thead><tbody>';
	foreach ( $batch['templates'] as $plan ) {
		$id = (int) $plan['source_post_id'];
		echo '<tr><td>' . esc_html( $plan['source_post_title'] . ' (' . $id . ')' ) . '</td><td>';
		if ( isset( $state['existing'][ $id ] ) ) {
			echo '<a href="' . esc_url( get_edit_post_link( $state['existing'][ $id ] ) ) . '">' . esc_html( $plan['target_title'] . ' (' . $state['existing'][ $id ] . ')' ) . '</a>';
		} else {
			echo esc_html( $plan['target_title'] . ' — do utworzenia' );
		}
		echo '</td><td>' . esc_html( (string) count( $plan['bricks_edits'] ) ) . '</td></tr>';
	}
	echo '</tbody></table>';
	if ( ! $state['errors'] ) {
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="bemke_create_chrome_en_drafts">';
		wp_nonce_field( 'bemke_create_chrome_en_drafts' );
		submit_button( $state['existing'] ? 'Synchronizuj menu EN' : 'Utwórz menu, nagłówek i stopkę EN jako szkice' );
		echo '</form>';
	}
	echo '<p>To narzędzie nie publikuje szablonów ani nie zmienia przełącznika języka. Przed publikacją stopki trzeba przygotować EN strony „Privacy Policy” i „Bemke Explore”, do których nadal prowadzą linki PL.</p>';
	foreach ( $batch['templates'] as $plan ) {
		echo '<details><summary>' . esc_html( $plan['target_title'] . ' — podgląd tekstów' ) . '</summary><table class="widefat striped"><thead><tr><th>Pole</th><th>Polski</th><th>Angielski</th></tr></thead><tbody>';
		foreach ( $plan['bricks_edits'] as $edit ) {
			echo '<tr><td>' . esc_html( $edit['element'] . '.' . $edit['path'] ) . '</td><td>' . esc_html( $edit['expected'] ) . '</td><td>' . esc_html( $edit['english'] ) . '</td></tr>';
		}
		echo '</tbody></table></details>';
	}
	echo '</div>';
}

/** Translate only internal Bricks links with an existing English counterpart. */
function bemke_child_chrome_remap_internal_links( &$elements, $exclude_ids = array() ) {
	foreach ( $elements as &$element ) {
		if ( in_array( $element['id'] ?? '', $exclude_ids, true ) || ! isset( $element['settings']['link'] ) || 'internal' !== ( $element['settings']['link']['type'] ?? '' ) ) {
			continue;
		}
		$old_id = (int) ( $element['settings']['link']['postId'] ?? 0 );
		$new_id = $old_id ? (int) pll_get_post( $old_id, 'en' ) : 0;
		if ( $new_id ) {
			$element['settings']['link']['postId'] = (string) $new_id;
		}
	}
	unset( $element );
}

function bemke_child_create_chrome_en_drafts() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	check_admin_referer( 'bemke_create_chrome_en_drafts' );
	$batch = bemke_child_get_chrome_translation_batch();
	if ( is_wp_error( $batch ) ) {
		wp_die( esc_html( $batch->get_error_message() ) );
	}
	$state = bemke_child_validate_chrome_translation( $batch );
	if ( $state['errors'] ) {
		wp_die( esc_html( 'Plan jest nieaktualny. Sprawdź Narzędzia → Bemke EN — nawigacja.' ) );
	}
	$menu_id = $state['menu'] ? (int) $state['menu']->term_id : wp_create_nav_menu( $batch['target_menu_name'] );
	if ( is_wp_error( $menu_id ) ) {
		wp_die( esc_html( $menu_id->get_error_message() ) );
	}
	update_term_meta( $menu_id, '_bemke_en_source_menu_id', (int) $batch['source_menu_id'] );
	pll_set_term_language( $menu_id, 'en' );
	if ( 'pl' === pll_get_term_language( (int) $batch['source_menu_id'], 'slug' ) && 'en' === pll_get_term_language( $menu_id, 'slug' ) ) {
		$term_translations       = (array) pll_get_term_translations( (int) $batch['source_menu_id'] );
		$term_translations['pl'] = (int) $batch['source_menu_id'];
		$term_translations['en'] = $menu_id;
		pll_save_term_translations( $term_translations );
	}
	$existing_items = wp_get_nav_menu_items( $menu_id, array( 'post_status' => 'publish' ) );
	$existing_items = is_array( $existing_items ) ? $existing_items : array();
	$mapped         = array();
	foreach ( $existing_items as $item ) {
		$source_id = (int) get_post_meta( $item->ID, '_bemke_en_source_menu_item_id', true );
		if ( $source_id ) {
			$mapped[ $source_id ] = $item->ID;
		}
	}
	foreach ( $batch['menu_items'] as $plan ) {
		$source_id = (int) $plan['source_item_id'];
		if ( ! isset( $state['ready'][ $source_id ] ) || isset( $mapped[ $source_id ] ) ) {
			continue;
		}
		$parent_id = (int) $plan['source_parent_id'];
		if ( $parent_id && ! isset( $mapped[ $parent_id ] ) ) {
			continue;
		}
		$en_page_id = (int) $state['ready'][ $source_id ];
		$args       = array(
			'menu-item-title'     => $plan['target_title'],
			'menu-item-parent-id' => $parent_id ? (int) $mapped[ $parent_id ] : 0,
			'menu-item-position'  => count( $mapped ) + 1,
			'menu-item-status'    => 'publish',
		);
		if ( '' !== $plan['fragment'] ) {
			$uri                          = trim( get_page_uri( $en_page_id ), '/' );
			$args['menu-item-type']       = 'custom';
			$args['menu-item-url']        = home_url( '/en/' . $uri . '/#' . $plan['fragment'] );
		} else {
			$args['menu-item-type']      = 'post_type';
			$args['menu-item-object']    = 'page';
			$args['menu-item-object-id'] = $en_page_id;
		}
		$new_item_id = wp_update_nav_menu_item( $menu_id, 0, $args );
		if ( is_wp_error( $new_item_id ) || ! $new_item_id ) {
			wp_die( esc_html( 'Nie udało się dodać pozycji menu: ' . $plan['target_title'] . '. Uruchom synchronizację ponownie.' ) );
		}
		update_post_meta( $new_item_id, '_bemke_en_source_menu_item_id', $source_id );
		$mapped[ $source_id ] = (int) $new_item_id;
	}
	foreach ( $batch['templates'] as $plan ) {
		$source_id = (int) $plan['source_post_id'];
		if ( isset( $state['existing'][ $source_id ] ) ) {
			$en_id    = $state['existing'][ $source_id ];
			$elements = get_post_meta( $en_id, $plan['source_meta_key'], true );
			if ( is_array( $elements ) ) {
				$original = $elements;
				bemke_child_chrome_remap_internal_links( $elements, 'header' === $plan['source_template_type'] ? array( 'ssrnqe', 'yaxlpv' ) : array() );
				if ( $elements !== $original ) {
					update_post_meta( $en_id, $plan['source_meta_key'], wp_slash( $elements ) );
				}
			}
			continue;
		}
		$elements = $state['templates'][ $source_id ]['elements'];
		foreach ( $plan['bricks_edits'] as $edit ) {
			$index = $state['templates'][ $source_id ]['indexes'][ $edit['element'] ];
			bemke_child_main_pages_write_path( $elements[ $index ], $edit['path'], $edit['english'] );
		}
		if ( 'header' === $plan['source_template_type'] ) {
			$index                                    = $state['templates'][ $source_id ]['indexes']['vhhhdt'];
			$elements[ $index ]['settings']['menu'] = (string) $menu_id;
		}
		bemke_child_chrome_remap_internal_links( $elements, 'header' === $plan['source_template_type'] ? array( 'ssrnqe', 'yaxlpv' ) : array() );
		$post_id = wp_insert_post( array( 'post_type' => 'bricks_template', 'post_status' => 'draft', 'post_title' => $plan['target_title'], 'post_content' => '', 'post_author' => get_current_user_id() ), true );
		if ( is_wp_error( $post_id ) ) {
			wp_die( esc_html( $post_id->get_error_message() ) );
		}
		update_post_meta( $post_id, '_bemke_chrome_en_source_id', $source_id );
		pll_set_post_language( $post_id, 'en' );
		if ( 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
			wp_die( esc_html( 'Szkic szablonu ' . $post_id . ' powstał, ale nie dostał języka EN. Sprawdź ustawienia typów wpisów Polylang.' ) );
		}
		update_post_meta( $post_id, $plan['source_meta_key'], wp_slash( $elements ) );
		update_post_meta( $post_id, '_bricks_template_type', $plan['source_template_type'] );
		update_post_meta( $post_id, '_bricks_template_settings', wp_slash( $state['templates'][ $source_id ]['settings'] ) );
		$mode = get_post_meta( $source_id, '_bricks_editor_mode', true );
		if ( '' !== $mode ) {
			update_post_meta( $post_id, '_bricks_editor_mode', $mode );
		}
		$translations       = (array) pll_get_post_translations( $source_id );
		$translations['pl'] = $source_id;
		$translations['en'] = $post_id;
		pll_save_post_translations( $translations );
		if ( (int) pll_get_post( $source_id, 'en' ) !== (int) $post_id ) {
			wp_die( esc_html( 'Szkic szablonu ' . $post_id . ' wymaga sprawdzenia połączenia Polylang.' ) );
		}
	}
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-chrome-translation&created=1' ) );
	exit;
}
