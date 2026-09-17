<?php
/**
 * Reviewed English drafts for the six primary Bemke pages.
 *
 * Source: WordPress WXR export from 17 September 2026 and the approved
 * tlumaczenie_bemkepl_EN.csv sheet. The importer never edits Polish posts.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_main_pages_translation_page' );
add_action( 'admin_post_bemke_create_main_pages_en_drafts', 'bemke_child_create_main_pages_en_drafts' );

function bemke_child_register_main_pages_translation_page() {
	add_management_page(
		'Bemke strony EN — partia 1',
		'Bemke strony EN',
		'manage_options',
		'bemke-main-pages-translation',
		'bemke_child_render_main_pages_translation_page'
	);
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_main_pages_translation_batch() {
	$path = get_stylesheet_directory() . '/data/main-pages-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_batch', 'Brakuje planu tłumaczenia głównych stron.' );
	}
	$batch = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$ids   = array( 173, 341, 376, 378, 857, 924 );
	if ( ! is_array( $batch ) || 'main-pages-1' !== ( $batch['batch'] ?? null ) || ! isset( $batch['plans'] ) || ! is_array( $batch['plans'] ) || count( $batch['plans'] ) !== count( $ids ) ) {
		return new WP_Error( 'invalid_batch', 'Plan tłumaczenia ma nieprawidłowy format.' );
	}
	foreach ( $batch['plans'] as $index => $plan ) {
		if (
			! is_array( $plan ) || $ids[ $index ] !== ( $plan['source_post_id'] ?? null ) ||
			! isset( $plan['source_post_title'], $plan['source_bricks_sha256'], $plan['source_bricks_elements'], $plan['source_excerpt'], $plan['target_title'], $plan['target_slug'], $plan['target_excerpt'], $plan['bricks_edits'], $plan['yoast_edits'] ) ||
			! is_array( $plan['bricks_edits'] ) || ! is_array( $plan['yoast_edits'] )
		) {
			return new WP_Error( 'invalid_batch', 'Nieprawidłowe dane strony w planie tłumaczenia.' );
		}
	}
	return $batch;
}

/** Read Bricks values through numeric or string keys in a dot-separated path. */
function bemke_child_main_pages_read_path( $element, $path ) {
	foreach ( explode( '.', $path ) as $part ) {
		if ( ! is_array( $element ) || ! array_key_exists( $part, $element ) ) {
			return null;
		}
		$element = $element[ $part ];
	}
	return $element;
}

/** Write only paths that were checked against their exact source values. */
function bemke_child_main_pages_write_path( &$element, $path, $value ) {
	$parts  = explode( '.', $path );
	$last   = array_pop( $parts );
	$cursor =& $element;
	foreach ( $parts as $part ) {
		$cursor =& $cursor[ $part ];
	}
	$cursor[ $last ] = $value;
}

/** Make rich-text values readable in the admin preview. */
function bemke_child_main_pages_preview_text( $html ) {
	$spaced = preg_replace( '/<(?:br|\/?div|\/?p|\/?li|\/?h[1-6])\b[^>]*>/i', ' ', $html );
	$plain  = wp_strip_all_tags( null === $spaced ? $html : $spaced, true );
	$single = preg_replace( '/\s+/u', ' ', $plain );
	return trim( null === $single ? $plain : $single );
}

/** Remap links between pages already translated in Polylang. */
function bemke_child_main_pages_remap_links( &$value, $translations ) {
	if ( ! is_array( $value ) ) {
		return;
	}
	foreach ( $value as $key => &$entry ) {
		if ( 'postId' === $key && ( is_string( $entry ) || is_int( $entry ) ) ) {
			$source_id = (int) $entry;
			if ( isset( $translations[ $source_id ] ) ) {
				$entry = is_string( $entry ) ? (string) $translations[ $source_id ] : (int) $translations[ $source_id ];
			}
		} else {
			bemke_child_main_pages_remap_links( $entry, $translations );
		}
	}
	unset( $entry );
}

/** @return array<string, mixed> */
function bemke_child_validate_main_pages_translation( $batch ) {
	$state = array( 'pages' => array(), 'errors' => array(), 'existing' => array(), 'orphans' => array() );
	foreach ( array( 'pll_get_post_language', 'pll_get_post', 'pll_get_post_translations', 'pll_set_post_language', 'pll_save_post_translations' ) as $name ) {
		if ( ! function_exists( $name ) ) {
			$state['errors'][] = 'Polylang musi być aktywny.';
			return $state;
		}
	}
	$options = get_option( 'polylang', array() );
	if ( is_array( $options ) && in_array( 'post_meta', (array) ( $options['sync'] ?? array() ), true ) ) {
		$state['errors'][] = 'Wyłącz synchronizację pól własnych w Polylang przed utworzeniem szkiców EN.';
	}
	foreach ( $batch['plans'] as $plan ) {
		$id     = (int) $plan['source_post_id'];
		$source = get_post( $id );
		if ( ! $source || 'page' !== $source->post_type || 'publish' !== $source->post_status || 'pl' !== pll_get_post_language( $id, 'slug' ) || $plan['source_post_title'] !== $source->post_title || $plan['source_excerpt'] !== $source->post_excerpt || 0 !== (int) $source->post_parent ) {
			$state['errors'][] = 'Strona PL ' . $id . ' nie odpowiada planowi lub nie jest opublikowaną stroną główną swojej gałęzi.';
			continue;
		}
		if ( ! current_user_can( 'edit_post', $id ) ) {
			$state['errors'][] = 'Brak uprawnień do strony ' . $id . '.';
			continue;
		}
		$existing = (int) pll_get_post( $id, 'en' );
		if ( $existing ) {
			$state['existing'][ $id ] = $existing;
		}
		$orphans = get_posts(
			array(
				'post_type'        => 'page',
				'post_status'      => array( 'draft', 'pending', 'private', 'publish', 'future' ),
				'meta_key'         => '_bemke_main_pages_en_source_id',
				'meta_value'       => (string) $id,
				'posts_per_page'   => 1,
				'suppress_filters' => true,
			)
		);
		if ( ! $existing && $orphans ) {
			$state['orphans'][ $id ] = (int) $orphans[0]->ID;
		}
		$elements = get_post_meta( $id, '_bricks_page_content_2', true );
		if ( ! is_array( $elements ) || count( $elements ) !== (int) $plan['source_bricks_elements'] || ! hash_equals( $plan['source_bricks_sha256'], hash( 'sha256', serialize( $elements ) ) ) ) {
			$state['errors'][] = 'Układ Bricks strony ' . $id . ' zmienił się od eksportu. Potrzebny jest nowy plan dla tej strony.';
			continue;
		}
		$indexes = array();
		foreach ( $elements as $index => $element ) {
			if ( isset( $element['id'] ) ) {
				$indexes[ $element['id'] ] = $index;
			}
		}
		foreach ( $plan['bricks_edits'] as $edit ) {
			if ( ! isset( $edit['element'], $edit['path'], $edit['expected'], $edit['english'] ) || ! is_string( $edit['expected'] ) || ! is_string( $edit['english'] ) ) {
				$state['errors'][] = 'Nieprawidłowe pole Bricks w planie strony ' . $id . '.';
				continue;
			}
			$current = isset( $indexes[ $edit['element'] ] ) ? bemke_child_main_pages_read_path( $elements[ $indexes[ $edit['element'] ] ], $edit['path'] ) : null;
			if ( $edit['expected'] !== $current ) {
				$state['errors'][] = 'Nie zgadza się pole Bricks ' . $id . ': ' . $edit['element'] . '.' . $edit['path'] . '.';
			}
		}
		foreach ( $plan['yoast_edits'] as $edit ) {
			if ( ! isset( $edit['key'], $edit['expected'], $edit['english'] ) || $edit['expected'] !== (string) get_post_meta( $id, $edit['key'], true ) ) {
				$state['errors'][] = 'Nie zgadza się pole Yoast strony ' . $id . '.';
			}
		}
		$state['pages'][ $id ] = array( 'source' => $source, 'elements' => $elements, 'indexes' => $indexes );
	}
	return $state;
}

function bemke_child_render_main_pages_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$batch = bemke_child_get_main_pages_translation_batch();
	?>
	<div class="wrap">
		<h1>Bemke EN — pierwsza partia głównych stron</h1>
		<p>Narzędzie tworzy sześć powiązanych szkiców EN z przetłumaczonymi polami Bricks, formularzem Kontakt i danymi Yoast. Strony PL pozostają bez zmian. Przełącznik języka w menu pozostaje skierowany na obecną zaślepkę.</p>
		<?php
		if ( is_wp_error( $batch ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html( $batch->get_error_message() ) . '</p></div></div>';
			return;
		}
		$state = bemke_child_validate_main_pages_translation( $batch );
		if ( $state['errors'] ) {
			echo '<div class="notice notice-error"><p>Wstrzymano tworzenie szkiców:</p><ul>';
			foreach ( $state['errors'] as $error ) {
				echo '<li>' . esc_html( $error ) . '</li>';
			}
			echo '</ul></div>';
		}
		if ( $state['orphans'] ) {
			echo '<div class="notice notice-warning"><p>Poprzednia próba pozostawiła szkic bez połączenia Polylang. Sprawdź go przed ponowieniem importu.</p></div>';
		}
		?>
		<table class="widefat striped"><thead><tr><th>Strona PL</th><th>Szkic EN</th><th>Pola Bricks</th><th>Pola Yoast</th></tr></thead><tbody>
		<?php foreach ( $batch['plans'] as $plan ) : ?>
			<?php $id = (int) $plan['source_post_id']; ?>
			<tr><td><?php echo esc_html( $plan['source_post_title'] . ' (' . $id . ')' ); ?></td><td>
			<?php if ( isset( $state['existing'][ $id ] ) ) : ?>
				<a href="<?php echo esc_url( get_edit_post_link( $state['existing'][ $id ] ) ); ?>"><?php echo esc_html( $plan['target_title'] . ' (' . $state['existing'][ $id ] . ')' ); ?></a>
			<?php elseif ( isset( $state['orphans'][ $id ] ) ) : ?>
				Szkic bez połączenia: <?php echo esc_html( (string) $state['orphans'][ $id ] ); ?>
			<?php else : ?>
				<?php echo esc_html( $plan['target_title'] . ' — do utworzenia' ); ?>
			<?php endif; ?>
			</td><td><?php echo esc_html( (string) count( $plan['bricks_edits'] ) ); ?></td><td><?php echo esc_html( (string) count( $plan['yoast_edits'] ) ); ?></td></tr>
		<?php endforeach; ?>
		</tbody></table>
		<?php if ( ! $state['errors'] && ! $state['orphans'] && ! $state['existing'] ) : ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="bemke_create_main_pages_en_drafts">
				<?php wp_nonce_field( 'bemke_create_main_pages_en_drafts' ); ?>
				<?php submit_button( 'Utwórz 6 szkiców EN' ); ?>
			</form>
		<?php endif; ?>
		<p>Przed publikacją sprawdź podgląd na komputerze i telefonie, linki do podstron z następnych partii oraz angielskie ALT obrazów. Pliki PDF pozostają teraz po polsku.</p>
		<?php foreach ( $batch['plans'] as $plan ) : ?>
			<details><summary><?php echo esc_html( $plan['target_title'] . ' — podgląd tłumaczeń' ); ?></summary>
				<table class="widefat striped"><thead><tr><th>Pole</th><th>Polski</th><th>Angielski</th></tr></thead><tbody>
				<?php foreach ( $plan['bricks_edits'] as $edit ) : ?>
					<tr><td><?php echo esc_html( $edit['element'] . '.' . $edit['path'] ); ?></td><td><?php echo esc_html( bemke_child_main_pages_preview_text( $edit['expected'] ) ); ?></td><td><?php echo esc_html( bemke_child_main_pages_preview_text( $edit['english'] ) ); ?></td></tr>
				<?php endforeach; ?>
				<?php foreach ( $plan['yoast_edits'] as $edit ) : ?>
					<tr><td><?php echo esc_html( $edit['key'] ); ?></td><td><?php echo esc_html( $edit['expected'] ); ?></td><td><?php echo esc_html( $edit['english'] ); ?></td></tr>
				<?php endforeach; ?>
				</tbody></table>
			</details>
		<?php endforeach; ?>
	</div>
	<?php
}

function bemke_child_create_main_pages_en_drafts() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	check_admin_referer( 'bemke_create_main_pages_en_drafts' );
	$batch = bemke_child_get_main_pages_translation_batch();
	if ( is_wp_error( $batch ) ) {
		wp_die( esc_html( $batch->get_error_message() ) );
	}
	$state = bemke_child_validate_main_pages_translation( $batch );
	if ( $state['errors'] || $state['orphans'] || $state['existing'] ) {
		wp_die( esc_html( 'Plan jest nieaktualny, istnieje już strona EN lub poprzednia próba nie została połączona. Sprawdź tabelę w Narzędzia → Bemke strony EN.' ) );
	}
	$created = array();
	$draft_elements = array();
	foreach ( $batch['plans'] as $plan ) {
		$source_id = (int) $plan['source_post_id'];
		$elements  = $state['pages'][ $source_id ]['elements'];
		foreach ( $plan['bricks_edits'] as $edit ) {
			$index = $state['pages'][ $source_id ]['indexes'][ $edit['element'] ];
			bemke_child_main_pages_write_path( $elements[ $index ], $edit['path'], $edit['english'] );
		}
		$post_id = wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'draft',
				'post_title'   => $plan['target_title'],
				'post_name'    => $plan['target_slug'],
				'post_excerpt' => $plan['target_excerpt'],
				'post_content' => '',
				'post_author'  => get_current_user_id(),
				'menu_order'   => $state['pages'][ $source_id ]['source']->menu_order,
			),
			true
		);
		if ( is_wp_error( $post_id ) ) {
			wp_die( esc_html( 'Utworzono ' . count( $created ) . ' szkiców. Dalszy import przerwano: ' . $post_id->get_error_message() ) );
		}
		update_post_meta( $post_id, '_bemke_main_pages_en_source_id', $source_id );
		pll_set_post_language( $post_id, 'en' );
		if ( 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
			wp_die( esc_html( 'Utworzono szkic ' . $post_id . ', lecz nie udało się przypisać języka EN. Sprawdź szkic ręcznie.' ) );
		}
		update_post_meta( $post_id, '_bricks_page_content_2', wp_slash( $elements ) );
		foreach ( array( '_bricks_editor_mode', '_bricks_template_type', '_thumbnail_id' ) as $key ) {
			$value = get_post_meta( $source_id, $key, true );
			if ( '' !== $value ) {
				update_post_meta( $post_id, $key, wp_slash( $value ) );
			}
		}
		foreach ( $plan['yoast_edits'] as $edit ) {
			update_post_meta( $post_id, $edit['key'], wp_slash( $edit['english'] ) );
		}
		foreach ( array( '_yoast_wpseo_opengraph-image', '_yoast_wpseo_opengraph-image-id', '_yoast_wpseo_twitter-image', '_yoast_wpseo_twitter-image-id' ) as $key ) {
			$value = get_post_meta( $source_id, $key, true );
			if ( '' !== $value ) {
				update_post_meta( $post_id, $key, wp_slash( $value ) );
			}
		}
		$translations       = (array) pll_get_post_translations( $source_id );
		$translations['pl'] = $source_id;
		$translations['en'] = $post_id;
		pll_save_post_translations( $translations );
		if ( (int) pll_get_post( $source_id, 'en' ) !== (int) $post_id ) {
			wp_die( esc_html( 'Utworzono szkic ' . $post_id . ', ale połączenie Polylang wymaga sprawdzenia.' ) );
		}
		$created[ $source_id ]       = $post_id;
		$draft_elements[ $post_id ] = $elements;
	}
	$linked = $created;
	$home_en = (int) pll_get_post( 7, 'en' );
	if ( $home_en ) {
		$linked[7] = $home_en;
	}
	foreach ( $draft_elements as $post_id => $elements ) {
		bemke_child_main_pages_remap_links( $elements, $linked );
		update_post_meta( $post_id, '_bricks_page_content_2', wp_slash( $elements ) );
	}
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-main-pages-translation&created=6' ) );
	exit;
}
