<?php
/**
 * One-time, reviewed creation of the English home-page draft.
 *
 * The plan was prepared from the 17 September 2026 WXR export and the
 * tlumaczenie_bemkepl_EN.csv translation sheet.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_home_translation_page' );
add_action( 'admin_post_bemke_create_home_en_draft', 'bemke_child_create_home_en_draft' );

function bemke_child_register_home_translation_page() {
	add_management_page(
		'Bemke Home EN',
		'Bemke Home EN',
		'manage_options',
		'bemke-home-translation',
		'bemke_child_render_home_translation_page'
	);
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_home_translation_plan() {
	$path = get_stylesheet_directory() . '/data/home-bemke-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_plan', 'Brakuje planu tłumaczenia strony głównej.' );
	}

	$plan = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if (
		! is_array( $plan ) ||
		7 !== ( $plan['source_post_id'] ?? null ) ||
		! isset( $plan['source_bricks_sha256'], $plan['bricks_edits'], $plan['yoast_edits'], $plan['target_excerpt'] ) ||
		! is_array( $plan['bricks_edits'] ) ||
		! is_array( $plan['yoast_edits'] )
	) {
		return new WP_Error( 'invalid_plan', 'Plan tłumaczenia strony głównej ma nieprawidłowy format.' );
	}

	return $plan;
}

/** Read a Bricks element value using a dot-separated path. */
function bemke_child_home_read_path( $element, $path ) {
	foreach ( explode( '.', $path ) as $part ) {
		if ( ! is_array( $element ) || ! array_key_exists( $part, $element ) ) {
			return null;
		}
		$element = $element[ $part ];
	}
	return $element;
}

/** Set a path only after its exact current value has been validated. */
function bemke_child_home_write_path( &$element, $path, $english ) {
	$parts = explode( '.', $path );
	$last  = array_pop( $parts );
	$cursor =& $element;
	foreach ( $parts as $part ) {
		$cursor =& $cursor[ $part ];
	}
	$cursor[ $last ] = $english;
}

/** Preserve word boundaries when previewing Bricks HTML as text. */
function bemke_child_home_preview_text( $html ) {
	$spaced = preg_replace( '/<(?:br|\/?div|\/?p)\b[^>]*>/i', ' ', $html );
	$plain  = wp_strip_all_tags( null === $spaced ? $html : $spaced, true );
	$single = preg_replace( '/\s+/u', ' ', $plain );
	return trim( null === $single ? $plain : $single );
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_validate_home_translation( $plan ) {
	$source = get_post( 7 );
	if (
		! $source ||
		'page' !== $source->post_type ||
		'publish' !== $source->post_status ||
		$plan['source_post_title'] !== $source->post_title ||
		(int) get_option( 'page_on_front' ) !== 7 ||
		! function_exists( 'pll_get_post_language' ) ||
		! function_exists( 'pll_get_post' ) ||
		! function_exists( 'pll_set_post_language' ) ||
		! function_exists( 'pll_save_post_translations' ) ||
		'pl' !== pll_get_post_language( 7, 'slug' )
	) {
		return new WP_Error( 'wrong_source', 'Strona 7 musi być opublikowaną polską stroną główną, a Polylang aktywny.' );
	}

	$existing_en = (int) pll_get_post( 7, 'en' );
	$created_drafts = get_posts(
		array(
			'post_type'        => 'page',
			'post_status'      => array( 'draft', 'pending', 'private', 'publish', 'future' ),
			'meta_key'         => '_bemke_home_en_source_id',
			'meta_value'       => '7',
			'posts_per_page'   => 1,
			'suppress_filters' => true,
		)
	);
	$orphan_en = ! $existing_en && $created_drafts ? (int) $created_drafts[0]->ID : 0;
	$elements    = get_post_meta( 7, '_bricks_page_content_2', true );
	$errors      = array();
	if ( ! is_array( $elements ) ) {
		$errors[] = 'Nie znaleziono układu Bricks na polskiej stronie głównej.';
	} elseif (
		count( $elements ) !== (int) $plan['source_bricks_elements'] ||
		! hash_equals( $plan['source_bricks_sha256'], hash( 'sha256', serialize( $elements ) ) )
	) {
		$errors[] = 'Polski układ Bricks zmienił się od eksportu. Przygotuj nowy plan na podstawie aktualnego eksportu.';
	}

	if ( $plan['source_excerpt'] !== $source->post_excerpt ) {
		$errors[] = 'Opis strony głównej zmienił się od eksportu.';
	}

	$options = get_option( 'polylang', array() );
	if ( is_array( $options ) && in_array( 'post_meta', (array) ( $options['sync'] ?? array() ), true ) ) {
		$errors[] = 'Wyłącz synchronizację pól własnych w Polylang przed utworzeniem szkicu EN.';
	}

	$indexes = array();
	if ( is_array( $elements ) ) {
		foreach ( $elements as $index => $element ) {
			if ( isset( $element['id'] ) ) {
				$indexes[ $element['id'] ] = $index;
			}
		}
		foreach ( $plan['bricks_edits'] as $edit ) {
			$current = isset( $indexes[ $edit['element'] ] )
				? bemke_child_home_read_path( $elements[ $indexes[ $edit['element'] ] ], $edit['path'] )
				: null;
			if ( $edit['expected'] !== $current ) {
				$errors[] = 'Nie zgadza się pole Bricks ' . $edit['element'] . '.' . $edit['path'] . '.';
			}
		}
	}

	foreach ( $plan['yoast_edits'] as $edit ) {
		if ( $edit['expected'] !== (string) get_post_meta( 7, $edit['key'], true ) ) {
			$errors[] = 'Nie zgadza się pole Yoast ' . $edit['key'] . '.';
		}
	}

	return array(
		'source'      => $source,
		'elements'    => $elements,
		'indexes'     => $indexes,
		'existing_en' => $existing_en,
		'orphan_en'   => $orphan_en,
		'errors'      => $errors,
	);
}

function bemke_child_render_home_translation_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$plan = bemke_child_get_home_translation_plan();
	?>
	<div class="wrap">
		<h1>Bemke Home EN — pierwszy szkic</h1>
		<p>Plan utworzy powiązaną stronę główną EN jako szkic. Skopiuje układ Bricks, przetłumaczy wskazane teksty i pola Yoast. Polska strona pozostanie opublikowana.</p>
		<?php
		if ( is_wp_error( $plan ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html( $plan->get_error_message() ) . '</p></div></div>';
			return;
		}
		$state = bemke_child_validate_home_translation( $plan );
		if ( is_wp_error( $state ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html( $state->get_error_message() ) . '</p></div></div>';
			return;
		}
		if ( $state['existing_en'] ) {
			echo '<div class="notice notice-info"><p>Szkic lub strona EN jest już połączona z polską stroną główną: <a href="' . esc_url( get_edit_post_link( $state['existing_en'] ) ) . '">otwórz stronę ' . esc_html( (string) $state['existing_en'] ) . '</a>.</p></div>';
		}
		if ( $state['orphan_en'] ) {
			echo '<div class="notice notice-warning"><p>Poprzednia próba utworzyła szkic ' . esc_html( (string) $state['orphan_en'] ) . ', ale nie połączyła go z polską stroną. Sprawdź go przed ponowieniem importu.</p></div>';
		}
		if ( $state['errors'] ) {
			echo '<div class="notice notice-error"><p>Wstrzymano tworzenie szkicu:</p><ul>';
			foreach ( $state['errors'] as $error ) {
				echo '<li>' . esc_html( $error ) . '</li>';
			}
			echo '</ul></div>';
		}
		?>
		<p>Plan obejmuje <?php echo esc_html( (string) count( $plan['bricks_edits'] ) ); ?> pól Bricks, <?php echo esc_html( (string) count( $plan['yoast_edits'] ) ); ?> pól Yoast i opis strony. Linki wewnętrzne, ALT obrazów, szablony nagłówka i stopki oraz formularz GetResponse wymagają osobnego sprawdzenia przed publikacją.</p>
		<?php if ( ! $state['errors'] && ! $state['existing_en'] && ! $state['orphan_en'] ) : ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="bemke_create_home_en_draft">
				<?php wp_nonce_field( 'bemke_create_home_en_draft' ); ?>
				<?php submit_button( 'Utwórz szkic strony głównej EN' ); ?>
			</form>
		<?php endif; ?>
		<details>
			<summary>Podgląd tekstów przed utworzeniem szkicu</summary>
			<table class="widefat striped"><thead><tr><th>Pole</th><th>Polski</th><th>Angielski</th></tr></thead><tbody>
			<?php foreach ( $plan['bricks_edits'] as $edit ) : ?>
				<tr><td><?php echo esc_html( $edit['element'] . '.' . $edit['path'] ); ?></td><td><?php echo esc_html( bemke_child_home_preview_text( $edit['expected'] ) ); ?></td><td><?php echo esc_html( bemke_child_home_preview_text( $edit['english'] ) ); ?></td></tr>
			<?php endforeach; ?>
			<?php foreach ( $plan['yoast_edits'] as $edit ) : ?>
				<tr><td><?php echo esc_html( $edit['key'] ); ?></td><td><?php echo esc_html( $edit['expected'] ); ?></td><td><?php echo esc_html( $edit['english'] ); ?></td></tr>
			<?php endforeach; ?>
			<tr><td>post_excerpt</td><td><?php echo esc_html( $plan['source_excerpt'] ); ?></td><td><?php echo esc_html( $plan['target_excerpt'] ); ?></td></tr>
			</tbody></table>
		</details>
	</div>
	<?php
}

function bemke_child_create_home_en_draft() {
	if ( ! current_user_can( 'manage_options' ) || ! current_user_can( 'edit_post', 7 ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	check_admin_referer( 'bemke_create_home_en_draft' );
	$plan = bemke_child_get_home_translation_plan();
	if ( is_wp_error( $plan ) ) {
		wp_die( esc_html( $plan->get_error_message() ) );
	}
	$state = bemke_child_validate_home_translation( $plan );
	if ( is_wp_error( $state ) || $state['errors'] || $state['existing_en'] || $state['orphan_en'] ) {
		wp_die( esc_html( is_wp_error( $state ) ? $state->get_error_message() : 'Plan jest nieaktualny lub istnieje już strona EN.' ) );
	}

	$elements = $state['elements'];
	foreach ( $plan['bricks_edits'] as $edit ) {
		$index = $state['indexes'][ $edit['element'] ];
		bemke_child_home_write_path( $elements[ $index ], $edit['path'], $edit['english'] );
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
			'menu_order'   => $state['source']->menu_order,
		),
		true
	);
	if ( is_wp_error( $post_id ) ) {
		wp_die( esc_html( $post_id->get_error_message() ) );
	}

	update_post_meta( $post_id, '_bemke_home_en_source_id', 7 );
	pll_set_post_language( $post_id, 'en' );
	if ( 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
		wp_die( esc_html( 'Utworzono szkic ' . $post_id . ', lecz nie udało się przypisać języka EN. Sprawdź szkic ręcznie.' ) );
	}

	update_post_meta( $post_id, '_bricks_page_content_2', wp_slash( $elements ) );
	foreach ( array( '_bricks_editor_mode', '_bricks_template_type', '_thumbnail_id' ) as $meta_key ) {
		$value = get_post_meta( 7, $meta_key, true );
		if ( '' !== $value ) {
			update_post_meta( $post_id, $meta_key, wp_slash( $value ) );
		}
	}
	foreach ( $plan['yoast_edits'] as $edit ) {
		update_post_meta( $post_id, $edit['key'], wp_slash( $edit['english'] ) );
	}
	foreach ( array( '_yoast_wpseo_opengraph-image', '_yoast_wpseo_opengraph-image-id', '_yoast_wpseo_twitter-image', '_yoast_wpseo_twitter-image-id' ) as $meta_key ) {
		$value = get_post_meta( 7, $meta_key, true );
		if ( '' !== $value ) {
			update_post_meta( $post_id, $meta_key, wp_slash( $value ) );
		}
	}

	$translations         = (array) pll_get_post_translations( 7 );
	$translations['pl']   = 7;
	$translations['en']   = $post_id;
	pll_save_post_translations( $translations );
	wp_safe_redirect( admin_url( 'tools.php?page=bemke-home-translation&created=' . $post_id ) );
	exit;
}
