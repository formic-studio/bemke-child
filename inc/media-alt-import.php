<?php
/** Review and import verified Polish and English alternatives for media images. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_media_alt_import_page' );
add_action( 'admin_post_bemke_import_media_alts', 'bemke_child_import_media_alts' );

/** Add a preview under Tools; the plan never runs automatically. */
function bemke_child_register_media_alt_import_page() {
	add_management_page(
		'Bemke — ALT obrazów PL i EN',
		'Bemke — ALT obrazów',
		'manage_options',
		'bemke-media-alts',
		'bemke_child_render_media_alt_import_page'
	);
}

/** @return array<string, mixed>|WP_Error */
function bemke_child_get_media_alt_plan() {
	$path = get_stylesheet_directory() . '/data/media-alt-bemke-pl-en.json';
	if ( ! is_readable( $path ) ) {
		return new WP_Error( 'missing_media_alt_plan', 'Brakuje planu opisów ALT.' );
	}

	$plan = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ! is_array( $plan ) || 'media-alt-1' !== ( $plan['batch'] ?? '' ) || ! isset( $plan['entries'] ) || ! is_array( $plan['entries'] ) ) {
		return new WP_Error( 'invalid_media_alt_plan', 'Plan opisów ALT ma nieprawidłowy format.' );
	}

	$seen = array();
	foreach ( $plan['entries'] as $entry ) {
		if (
			! is_array( $entry ) ||
			! isset( $entry['id'], $entry['file'], $entry['expected_pl'], $entry['pl'], $entry['en'] ) ||
			! is_int( $entry['id'] ) || $entry['id'] <= 0 || isset( $seen[ $entry['id'] ] ) ||
			! is_string( $entry['file'] ) || ! preg_match( '#^[0-9]{4}/[0-9]{2}/[^/]+$#u', $entry['file'] ) ||
			! is_string( $entry['expected_pl'] ) || ! is_string( $entry['pl'] ) || '' === trim( $entry['pl'] ) ||
			! is_string( $entry['en'] ) || '' === trim( $entry['en'] )
		) {
			return new WP_Error( 'invalid_media_alt_entry', 'Plan zawiera nieprawidłowy lub powtórzony obraz.' );
		}
		$seen[ $entry['id'] ] = true;
	}

	return $plan;
}

/** Inspect one attachment against the public snapshot before any write. */
function bemke_child_get_media_alt_entry_state( $entry ) {
	$id = $entry['id'];
	if ( ! bemke_child_is_image_attachment( $id ) || ! current_user_can( 'edit_post', $id ) ) {
		return array( 'status' => 'conflict', 'reason' => 'Obraz nie istnieje albo brak uprawnień.', 'pl' => '', 'en' => '' );
	}

	$file = (string) get_post_meta( $id, '_wp_attached_file', true );
	if ( $file !== $entry['file'] ) {
		return array( 'status' => 'conflict', 'reason' => 'Plik obrazu zmienił się od przeglądu.', 'pl' => '', 'en' => '' );
	}

	$pl = trim( (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) );
	$en = trim( (string) get_post_meta( $id, BEMKE_CHILD_IMAGE_ALT_EN_META, true ) );
	if ( '1' === (string) get_post_meta( $id, BEMKE_CHILD_IMAGE_DECORATIVE_META, true ) ) {
		return array( 'status' => 'decorative', 'reason' => 'Oznaczony jako dekoracyjny.', 'pl' => $pl, 'en' => $en );
	}
	if ( $pl !== $entry['expected_pl'] && $pl !== $entry['pl'] ) {
		return array( 'status' => 'conflict', 'reason' => 'ALT PL zmienił się od przeglądu.', 'pl' => $pl, 'en' => $en );
	}

	$write_pl = $pl !== $entry['pl'];
	$write_en = '' === $en;
	return array(
		'status'   => $write_pl || $write_en ? 'ready' : 'done',
		'reason'   => '' !== $en && $en !== $entry['en'] ? 'Istniejący ALT EN zostanie zachowany.' : '',
		'pl'       => $pl,
		'en'       => $en,
		'write_pl' => $write_pl,
		'write_en' => $write_en,
	);
}

/** Display 40-image batches, with the current and proposed text visible. */
function bemke_child_render_media_alt_import_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}

	echo '<div class="wrap"><h1>Bemke — opisy ALT obrazów PL i EN</h1>';
	$plan = bemke_child_get_media_alt_plan();
	if ( is_wp_error( $plan ) ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $plan->get_error_message() ) . '</p></div></div>';
		return;
	}

	if ( isset( $_GET['pl_saved'], $_GET['en_saved'] ) ) {
		echo '<div class="notice notice-success"><p>' . esc_html( sprintf( 'Zapisano %d opisów PL i %d opisów EN.', absint( $_GET['pl_saved'] ), absint( $_GET['en_saved'] ) ) ) . '</p></div>';
	}
	if ( isset( $_GET['skipped'] ) && absint( $_GET['skipped'] ) ) {
		echo '<div class="notice notice-warning"><p>' . esc_html( sprintf( 'Pominięto %d obrazów ze zmienionymi danymi lub oznaczonych jako dekoracyjne. Sprawdź wiersze poniżej.', absint( $_GET['skipped'] ) ) ) . '</p></div>';
	}

	echo '<p>Plan obejmuje ' . esc_html( (string) count( $plan['entries'] ) ) . ' obrazów: wpisy z pliku tłumaczeń oraz zdjęcia opisane po obejrzeniu. Import nie zmienia zdjęć ani stron. Zachowuje wpisane wcześniej opisy EN, nie dotyka obrazów dekoracyjnych i pomija zmienione pliki lub polskie opisy.</p>';
	$chunks = array_chunk( $plan['entries'], 40 );
	foreach ( $chunks as $chunk_index => $entries ) {
		$states = array();
		$counts = array( 'ready' => 0, 'done' => 0, 'conflict' => 0, 'decorative' => 0 );
		foreach ( $entries as $entry ) {
			$state = bemke_child_get_media_alt_entry_state( $entry );
			$states[ $entry['id'] ] = $state;
			++$counts[ $state['status'] ];
		}
		echo '<h2>Partia ' . esc_html( (string) ( $chunk_index + 1 ) ) . '</h2><p>Do zapisania: ' . esc_html( (string) $counts['ready'] ) . ', gotowe: ' . esc_html( (string) $counts['done'] ) . ', do sprawdzenia: ' . esc_html( (string) ( $counts['conflict'] + $counts['decorative'] ) ) . '.</p>';
		if ( $counts['ready'] ) {
			echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="bemke_import_media_alts"><input type="hidden" name="chunk" value="' . esc_attr( (string) $chunk_index ) . '">';
			wp_nonce_field( 'bemke_import_media_alts_' . $chunk_index );
			submit_button( 'Zapisz opisy ALT — partia ' . ( $chunk_index + 1 ), 'primary', 'submit', false );
			echo '</form>';
		}
		echo '<details><summary>Sprawdź obrazy i teksty w tej partii</summary><table class="widefat striped"><thead><tr><th>Obraz</th><th>ALT PL obecnie → po zmianie</th><th>ALT EN po zmianie</th><th>Status</th></tr></thead><tbody>';
		foreach ( $entries as $entry ) {
			$state = $states[ $entry['id'] ];
			$thumb = wp_get_attachment_image_url( $entry['id'], 'thumbnail' );
			$img   = $thumb ? '<img src="' . esc_url( $thumb ) . '" width="80" height="80" loading="lazy" style="object-fit:cover" alt="">' : '';
			$status_labels = array( 'ready' => 'Do zapisania', 'done' => 'Gotowe', 'conflict' => 'Do sprawdzenia', 'decorative' => 'Dekoracyjny' );
			$final_en = $state['en'] ? $state['en'] : $entry['en'];
			echo '<tr><td>' . $img . '<br><a href="' . esc_url( get_edit_post_link( $entry['id'] ) ) . '">#' . esc_html( (string) $entry['id'] ) . '</a><br><small>' . esc_html( wp_basename( $entry['file'] ) ) . '</small></td>';
			echo '<td>' . esc_html( $state['pl'] ) . ' → <strong>' . esc_html( $entry['pl'] ) . '</strong></td><td>' . esc_html( $final_en ) . '</td><td>' . esc_html( $status_labels[ $state['status'] ] ) . ( $state['reason'] ? '<br>' . esc_html( $state['reason'] ) : '' ) . '</td></tr>';
		}
		echo '</tbody></table></details>';
	}
	echo '<p>To pierwszy zestaw obejmujący obrazy ze stron publicznych i ostatnio dodane grafiki. Pozostałe obrazy w bibliotece wymagają oceny ich użycia; nie każdy potrzebuje ALT.</p></div>';
}

/** Save one bounded batch; rerunning it is safe. */
function bemke_child_import_media_alts() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}
	$chunk_index = isset( $_POST['chunk'] ) ? absint( wp_unslash( $_POST['chunk'] ) ) : -1;
	check_admin_referer( 'bemke_import_media_alts_' . $chunk_index );
	$plan = bemke_child_get_media_alt_plan();
	if ( is_wp_error( $plan ) ) {
		wp_die( esc_html( $plan->get_error_message() ) );
	}
	$chunks = array_chunk( $plan['entries'], 40 );
	if ( ! isset( $chunks[ $chunk_index ] ) ) {
		wp_die( esc_html( 'Nieprawidłowa partia obrazów.' ) );
	}

	$pl_saved = 0;
	$en_saved = 0;
	$skipped  = 0;
	foreach ( $chunks[ $chunk_index ] as $entry ) {
		$state = bemke_child_get_media_alt_entry_state( $entry );
		if ( 'conflict' === $state['status'] || 'decorative' === $state['status'] ) {
			++$skipped;
			continue;
		}
		if ( 'ready' !== $state['status'] ) {
			continue;
		}
		if ( $state['write_pl'] ) {
			update_post_meta( $entry['id'], '_wp_attachment_image_alt', $entry['pl'] );
			++$pl_saved;
		}
		if ( $state['write_en'] ) {
			update_post_meta( $entry['id'], BEMKE_CHILD_IMAGE_ALT_EN_META, $entry['en'] );
			++$en_saved;
		}
	}

	wp_safe_redirect(
		add_query_arg(
			array( 'page' => 'bemke-media-alts', 'pl_saved' => $pl_saved, 'en_saved' => $en_saved, 'skipped' => $skipped ),
			admin_url( 'tools.php' )
		)
	);
	exit;
}
