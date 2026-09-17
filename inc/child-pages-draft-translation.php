<?php
/** Reviewed English drafts for six second-level Bemke pages. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_child_pages_translation_page' );
add_action( 'admin_post_bemke_create_child_pages_en_drafts', 'bemke_child_create_child_pages_en_drafts' );

function bemke_child_register_child_pages_translation_page() {
	add_management_page(
		'Bemke EN — partia 2',
		'Bemke EN — partia 2',
		'manage_options',
		'bemke-child-pages-translation',
		'bemke_child_render_child_pages_translation_page'
	);
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_child_pages_translation_batch() {
	$path = get_stylesheet_directory() . '/data/child-pages-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_batch', 'Brakuje planu drugiej partii stron.' );
	}
	$batch = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$ids   = array( 275, 317, 445, 460, 981, 996 );
	if ( ! is_array( $batch ) || 'child-pages-2' !== ( $batch['batch'] ?? null ) || ! isset( $batch['plans'] ) || ! is_array( $batch['plans'] ) || count( $batch['plans'] ) !== count( $ids ) ) {
		return new WP_Error( 'invalid_batch', 'Plan drugiej partii ma nieprawidłowy format.' );
	}
	foreach ( $batch['plans'] as $index => $plan ) {
		if ( ! is_array( $plan ) || $ids[ $index ] !== ( $plan['source_post_id'] ?? null ) || ! isset( $plan['source_post_parent'], $plan['source_post_title'], $plan['source_excerpt'], $plan['source_bricks_sha256'], $plan['source_bricks_elements'], $plan['target_title'], $plan['target_slug'], $plan['target_excerpt'], $plan['bricks_edits'], $plan['yoast_edits'] ) || ! is_array( $plan['bricks_edits'] ) || ! is_array( $plan['yoast_edits'] ) ) {
			return new WP_Error( 'invalid_batch', 'Nieprawidłowe dane strony w drugiej partii.' );
		}
	}
	return $batch;
}

/** @return array<string, mixed> */
function bemke_child_validate_child_pages_translation( $batch ) {
	$state = array( 'pages' => array(), 'errors' => array(), 'existing' => array(), 'orphans' => array() );
	foreach ( array( 'pll_get_post_language', 'pll_get_post', 'pll_get_post_translations', 'pll_set_post_language', 'pll_save_post_translations' ) as $name ) {
		if ( ! function_exists( $name ) ) {
			$state['errors'][] = 'Polylang musi być aktywny.';
			return $state;
		}
	}
	$options = get_option( 'polylang', array() );
	if ( is_array( $options ) && in_array( 'post_meta', (array) ( $options['sync'] ?? array() ), true ) ) {
		$state['errors'][] = 'Wyłącz synchronizację pól własnych w Polylang.';
	}
	foreach ( $batch['plans'] as $plan ) {
		$id     = (int) $plan['source_post_id'];
		$source = get_post( $id );
		if ( ! $source ) {
			$state['errors'][] = 'Nie znaleziono strony PL ' . $id . '.';
			continue;
		}
		$problems = array();
		if ( 'page' !== $source->post_type || 'publish' !== $source->post_status ) {
			$problems[] = 'typ lub status';
		}
		if ( 'pl' !== pll_get_post_language( $id, 'slug' ) ) {
			$problems[] = 'język PL';
		}
		if ( $source->post_title !== $plan['source_post_title'] ) {
			$problems[] = 'tytuł';
		}
		if ( $source->post_excerpt !== $plan['source_excerpt'] ) {
			$problems[] = 'opis (post_excerpt)';
		}
		if ( (int) $source->post_parent !== (int) $plan['source_post_parent'] ) {
			$problems[] = 'strona nadrzędna PL';
		}
		$parent_en = (int) pll_get_post( (int) $plan['source_post_parent'], 'en' );
		if ( ! $parent_en || 'en' !== pll_get_post_language( $parent_en, 'slug' ) ) {
			$problems[] = 'brak nadrzędnego szkicu EN';
		}
		if ( ! current_user_can( 'edit_post', $id ) ) {
			$problems[] = 'uprawnienia';
		}
		if ( $problems ) {
			$state['errors'][] = 'Strona PL ' . $id . ': ' . implode( ', ', $problems ) . '.';
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
				'meta_key'         => '_bemke_child_pages_en_source_id',
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
			$state['errors'][] = 'Układ Bricks strony ' . $id . ' zmienił się od eksportu.';
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
				$state['errors'][] = 'Nieprawidłowe pole Bricks strony ' . $id . '.';
				continue;
			}
			$current = isset( $indexes[ $edit['element'] ] ) ? bemke_child_main_pages_read_path( $elements[ $indexes[ $edit['element'] ] ], $edit['path'] ) : null;
			if ( $current !== $edit['expected'] ) {
				$state['errors'][] = 'Nie zgadza się pole Bricks ' . $id . ': ' . $edit['element'] . '.' . $edit['path'] . '.';
			}
		}
		foreach ( $plan['yoast_edits'] as $edit ) {
			if ( ! isset( $edit['key'], $edit['expected'], $edit['english'] ) || $edit['expected'] !== (string) get_post_meta( $id, $edit['key'], true ) ) {
				$state['errors'][] = 'Nie zgadza się pole Yoast strony ' . $id . '.';
			}
		}
		$state['pages'][ $id ] = array( 'source' => $source, 'elements' => $elements, 'indexes' => $indexes, 'parent_en' => $parent_en );
	}
	return $state;
}

function bemke_child_render_child_pages_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$batch = bemke_child_get_child_pages_translation_batch();
	?>
	<div class="wrap">
		<h1>Bemke EN — druga partia podstron</h1>
		<p>Narzędzie tworzy sześć podrzędnych szkiców EN z tekstami Bricks i polami Yoast. Polskie strony oraz publiczne menu pozostają bez zmian.</p>
		<?php
		if ( is_wp_error( $batch ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html( $batch->get_error_message() ) . '</p></div></div>';
			return;
		}
		$state = bemke_child_validate_child_pages_translation( $batch );
		if ( $state['errors'] ) {
			echo '<div class="notice notice-error"><p>Wstrzymano tworzenie szkiców:</p><ul>';
			foreach ( $state['errors'] as $error ) {
				echo '<li>' . esc_html( $error ) . '</li>';
			}
			echo '</ul></div>';
		}
		if ( $state['orphans'] ) {
			echo '<div class="notice notice-warning"><p>Poprzednia próba pozostawiła szkic bez powiązania Polylang. Sprawdź go przed ponowieniem importu.</p></div>';
		}
		?>
		<table class="widefat striped"><thead><tr><th>Strona PL</th><th>Rodzic EN</th><th>Szkic EN</th><th>Bricks</th><th>Yoast</th></tr></thead><tbody>
		<?php foreach ( $batch['plans'] as $plan ) : ?>
			<?php $id = (int) $plan['source_post_id']; ?>
			<tr><td><?php echo esc_html( $plan['source_post_title'] . ' (' . $id . ')' ); ?></td><td><?php echo esc_html( (string) ( $state['pages'][ $id ]['parent_en'] ?? '—' ) ); ?></td><td>
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
				<input type="hidden" name="action" value="bemke_create_child_pages_en_drafts">
				<?php wp_nonce_field( 'bemke_create_child_pages_en_drafts' ); ?>
				<?php submit_button( 'Utwórz 6 szkiców EN — partia 2' ); ?>
			</form>
		<?php endif; ?>
		<p>Listy dokumentów, komunikatów prasowych i ofert pracy pochodzą z osobnych typów wpisów. Przetłumaczymy je w kolejnych partiach; pliki PDF pozostają na razie po polsku.</p>
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

function bemke_child_create_child_pages_en_drafts() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	check_admin_referer( 'bemke_create_child_pages_en_drafts' );
	$batch = bemke_child_get_child_pages_translation_batch();
	if ( is_wp_error( $batch ) ) {
		wp_die( esc_html( $batch->get_error_message() ) );
	}
	$state = bemke_child_validate_child_pages_translation( $batch );
	if ( $state['errors'] || $state['orphans'] || $state['existing'] ) {
		wp_die( esc_html( 'Plan jest nieaktualny lub szkice EN już istnieją. Sprawdź Narzędzia → Bemke EN — partia 2.' ) );
	}
	$created = array();
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
				'post_parent'  => $state['pages'][ $source_id ]['parent_en'],
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
		update_post_meta( $post_id, '_bemke_child_pages_en_source_id', $source_id );
		pll_set_post_language( $post_id, 'en' );
		if ( 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
			wp_die( esc_html( 'Utworzono szkic ' . $post_id . ', lecz nie udało się przypisać języka EN.' ) );
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
		$created[ $source_id ] = $post_id;
	}
	$linked = array();
	foreach ( array( 7, 173, 275, 317, 341, 376, 378, 380, 445, 460, 857, 924, 981, 996 ) as $source_id ) {
		$en_id = (int) pll_get_post( $source_id, 'en' );
		if ( $en_id ) {
			$linked[ $source_id ] = $en_id;
		}
	}
	foreach ( $linked as $en_id ) {
		$elements = get_post_meta( $en_id, '_bricks_page_content_2', true );
		if ( is_array( $elements ) ) {
			bemke_child_main_pages_remap_links( $elements, $linked );
			update_post_meta( $en_id, '_bricks_page_content_2', wp_slash( $elements ) );
		}
	}
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-child-pages-translation&created=6' ) );
	exit;
}
