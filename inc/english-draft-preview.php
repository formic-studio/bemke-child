<?php
/** Show translated dynamic content in English page previews while it remains in draft. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'bricks/posts/query_vars', 'bemke_child_preview_english_strategy_slides', 10, 4 );
add_filter( 'bricks/posts/query_vars', 'bemke_child_preview_english_job_offers', 10, 4 );
add_filter( 'bricks/posts/query_vars', 'bemke_child_preview_english_press_releases', 10, 4 );
add_filter( 'post_type_link', 'bemke_child_link_to_english_content_preview', 10, 2 );
add_filter( 'bricks/active_templates', 'bemke_child_preview_english_content_template', 10, 3 );
add_action( 'admin_menu', 'bemke_child_register_english_preview_diagnostics' );

function bemke_child_preview_english_strategy_slides( $query_vars, $settings, $element_id, $element_name ) {
	unset( $settings, $element_name );

	if ( ! in_array( $element_id, array( 'umcjbl', 'nwbnkz' ), true ) || ! function_exists( 'pll_get_post' ) || ! function_exists( 'pll_get_post_language' ) ) {
		return $query_vars;
	}

	$page_id = get_queried_object_id();
	if ( ! $page_id || (int) pll_get_post( 173, 'en' ) !== (int) $page_id || 'draft' !== get_post_status( $page_id ) || ! current_user_can( 'edit_post', $page_id ) ) {
		return $query_vars;
	}

	$slide_ids = array();
	foreach ( array( 1190, 1191, 1192, 1193, 1194, 1195, 1196 ) as $source_id ) {
		$slide_id = (int) pll_get_post( $source_id, 'en' );
		if ( $slide_id && 'strategia-2050' === get_post_type( $slide_id ) && 'en' === pll_get_post_language( $slide_id, 'slug' ) && in_array( get_post_status( $slide_id ), array( 'draft', 'publish' ), true ) ) {
			$slide_ids[] = $slide_id;
		}
	}

	$query_vars['post__in']    = $slide_ids ? $slide_ids : array( 0 );
	$query_vars['post_status'] = array( 'draft', 'publish' );
	$query_vars['lang']        = 'en';

	return $query_vars;
}

/** Show the translated job-offer drafts in the English Careers page preview. */
function bemke_child_preview_english_job_offers( $query_vars, $settings, $element_id, $element_name ) {
	unset( $settings, $element_name );

	if ( 'othbrn' !== $element_id || ! function_exists( 'pll_get_post' ) || ! function_exists( 'pll_get_post_language' ) ) {
		return $query_vars;
	}

	$page_id = get_queried_object_id();
	if ( ! $page_id || (int) pll_get_post( 996, 'en' ) !== (int) $page_id || 'draft' !== get_post_status( $page_id ) || ! current_user_can( 'edit_post', $page_id ) ) {
		return $query_vars;
	}

	$offer_ids = array();
	foreach ( array( 1021, 1022, 3728 ) as $source_id ) {
		$offer_id = (int) pll_get_post( $source_id, 'en' );
		if ( $offer_id && 'oferta-pracy' === get_post_type( $offer_id ) && 'en' === pll_get_post_language( $offer_id, 'slug' ) && in_array( get_post_status( $offer_id ), array( 'draft', 'publish' ), true ) ) {
			$offer_ids[] = $offer_id;
		}
	}

	$query_vars['post__in']    = $offer_ids ? $offer_ids : array( 0 );
	$query_vars['post_status'] = array( 'draft', 'publish' );
	$query_vars['lang']        = 'en';

	return $query_vars;
}

/** Show translated press-release drafts in the English For the Media preview. */
function bemke_child_preview_english_press_releases( $query_vars, $settings, $element_id, $element_name ) {
	unset( $settings, $element_name );

	if ( 'csqbxn' !== $element_id || ! function_exists( 'pll_get_post' ) || ! function_exists( 'pll_get_post_language' ) ) {
		return $query_vars;
	}

	$page_id = get_queried_object_id();
	if ( ! $page_id || (int) pll_get_post( 981, 'en' ) !== (int) $page_id || 'draft' !== get_post_status( $page_id ) || ! current_user_can( 'edit_post', $page_id ) ) {
		return $query_vars;
	}

	$release_ids = array();
	foreach ( array( 2934, 3657 ) as $source_id ) {
		$release_id = (int) pll_get_post( $source_id, 'en' );
		if ( $release_id && 'komunikat-prasowy' === get_post_type( $release_id ) && 'en' === pll_get_post_language( $release_id, 'slug' ) && in_array( get_post_status( $release_id ), array( 'draft', 'publish' ), true ) ) {
			$release_ids[] = $release_id;
		}
	}

	$query_vars['post__in']    = $release_ids ? $release_ids : array( 0 );
	$query_vars['post_status'] = array( 'draft', 'publish' );
	$query_vars['lang']        = 'en';

	return $query_vars;
}

/** Link dynamic cards on English draft pages to their WordPress previews. */
function bemke_child_link_to_english_content_preview( $post_link, $post ) {
	if ( ! ( $post instanceof WP_Post ) || ! in_array( $post->post_type, array( 'oferta-pracy', 'komunikat-prasowy', 'darczynca' ), true ) || 'draft' !== $post->post_status || ! function_exists( 'pll_get_post_language' ) ) {
		return $post_link;
	}

	$page_id = get_queried_object_id();
	if ( ! $page_id || 'draft' !== get_post_status( $page_id ) || 'en' !== pll_get_post_language( $page_id, 'slug' ) || 'en' !== pll_get_post_language( $post->ID, 'slug' ) || ! current_user_can( 'edit_post', $page_id ) || ! current_user_can( 'edit_post', $post->ID ) ) {
		return $post_link;
	}

	return add_query_arg( 'preview', 'true', $post_link );
}

/** Apply translated Bricks templates to English content drafts for editors only. */
function bemke_child_preview_english_content_template( $active_templates, $post_id, $content_type ) {
	if ( 'content' !== $content_type || 'draft' !== get_post_status( $post_id ) || ! current_user_can( 'edit_post', $post_id ) || ! function_exists( 'pll_get_post' ) || ! function_exists( 'pll_get_post_language' ) || 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
		return $active_templates;
	}

	$source_templates = array(
		'oferta-pracy'      => 2889,
		'komunikat-prasowy' => 2824,
		'darczynca'         => 2856,
	);
	$post_type = get_post_type( $post_id );
	if ( ! isset( $source_templates[ $post_type ] ) ) {
		return $active_templates;
	}

	$template_id = (int) pll_get_post( $source_templates[ $post_type ], 'en' );
	if ( $template_id && 'bricks_template' === get_post_type( $template_id ) && 'en' === pll_get_post_language( $template_id, 'slug' ) && in_array( get_post_status( $template_id ), array( 'draft', 'publish' ), true ) ) {
		$active_templates['content'] = $template_id;
	}

	return $active_templates;
}

/** Inspect the related drafts in wp-admin, without relying on a preview URL. */
function bemke_child_register_english_preview_diagnostics() {
	add_management_page( 'Bemke EN — diagnostyka', 'Bemke EN — diagnostyka', 'manage_options', 'bemke-en-preview-diagnostics', 'bemke_child_render_english_preview_diagnostics' );
}

function bemke_child_render_english_preview_diagnostics() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak dostępu.', 'bemke-child' ) );
	}

	echo '<div class="wrap"><h1>Bemke EN — diagnostyka szkiców</h1><p>Wersja 2026-09-17-c. Odczyt bez zmian w treściach.</p>';
	if ( ! function_exists( 'pll_get_post' ) || ! function_exists( 'pll_get_post_language' ) ) {
		echo '<p>Polylang nie jest dostępny.</p></div>';
		return;
	}

	$source_ids = array( 2889, 2824, 2856, 1021, 1022, 3728, 2934, 3657 );
	echo '<table class="widefat striped"><thead><tr><th>PL ID</th><th>Typ PL</th><th>EN ID</th><th>Status EN</th><th>Język EN</th><th>Elementy Bricks w meta</th><th>Elementy widziane przez Bricks</th><th>Wybrany szablon</th></tr></thead><tbody>';
	foreach ( $source_ids as $source_id ) {
		$english_id = (int) pll_get_post( $source_id, 'en' );
		$elements   = $english_id ? get_post_meta( $english_id, '_bricks_page_content_2', true ) : null;
		$bricks     = $english_id && class_exists( '\\Bricks\\Database' ) ? \Bricks\Database::get_data( $english_id, 'content' ) : null;
		$selected   = $english_id && 'bricks_template' !== get_post_type( $english_id ) ? apply_filters( 'bricks/active_templates', array(), $english_id, 'content' ) : array();
		$values     = array(
			$source_id,
			get_post_type( $source_id ) ?: 'brak',
			$english_id ?: 'brak',
			$english_id ? get_post_status( $english_id ) : 'brak',
			$english_id ? pll_get_post_language( $english_id, 'slug' ) : 'brak',
			is_array( $elements ) ? count( $elements ) : 0,
			is_array( $bricks ) ? count( $bricks ) : 0,
			$selected['content'] ?? 'brak',
		);
		echo '<tr>';
		foreach ( $values as $value ) {
			echo '<td>' . esc_html( (string) $value ) . '</td>';
		}
		echo '</tr>';
	}
	echo '</tbody></table></div>';
}
