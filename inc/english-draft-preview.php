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
add_filter( 'bricks/active_templates', 'bemke_child_preview_english_content_template_final_trace', PHP_INT_MAX, 3 );
add_action( 'wp_footer', 'bemke_child_english_content_preview_diagnostics', 99 );

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
	if ( isset( $_GET['bemke_preview_debug'] ) && '1' === $_GET['bemke_preview_debug'] && current_user_can( 'edit_post', $post_id ) ) {
		$GLOBALS['bemke_child_preview_template_trace'][] = array(
			'content_type' => $content_type,
			'post_id'      => (int) $post_id,
			'post_status'  => get_post_status( $post_id ),
			'before'       => $active_templates,
		);
	}

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

/** Record the selected template after all other Bricks filters have run. */
function bemke_child_preview_english_content_template_final_trace( $active_templates, $post_id, $content_type ) {
	if ( isset( $_GET['bemke_preview_debug'] ) && '1' === $_GET['bemke_preview_debug'] && current_user_can( 'edit_post', $post_id ) ) {
		$GLOBALS['bemke_child_preview_template_trace'][] = array(
			'final_content_type' => $content_type,
			'post_id'            => (int) $post_id,
			'after'              => $active_templates,
		);
	}

	return $active_templates;
}

/** Show a one-request diagnostic only to editors viewing an English draft. */
function bemke_child_english_content_preview_diagnostics() {
	if ( ! isset( $_GET['bemke_preview_debug'] ) || '1' !== $_GET['bemke_preview_debug'] || ! function_exists( 'pll_get_post' ) || ! function_exists( 'pll_get_post_language' ) ) {
		return;
	}

	$post_id = get_queried_object_id();
	if ( ! $post_id || 'draft' !== get_post_status( $post_id ) || ! current_user_can( 'edit_post', $post_id ) || 'en' !== pll_get_post_language( $post_id, 'slug' ) ) {
		return;
	}

	$source_templates = array(
		'oferta-pracy'      => 2889,
		'komunikat-prasowy' => 2824,
		'darczynca'         => 2856,
	);
	$post_type = get_post_type( $post_id );
	if ( ! isset( $source_templates[ $post_type ] ) ) {
		return;
	}

	$template_id = (int) pll_get_post( $source_templates[ $post_type ], 'en' );
	$elements    = $template_id ? get_post_meta( $template_id, '_bricks_page_content_2', true ) : null;
	$details     = array(
		'preview_debug_version' => '2026-09-17-b',
		'entry_id'              => $post_id,
		'entry_type'            => $post_type,
		'entry_status'          => get_post_status( $post_id ),
		'entry_language'        => pll_get_post_language( $post_id, 'slug' ),
		'template_id'           => $template_id,
		'template_type'         => $template_id ? get_post_type( $template_id ) : null,
		'template_status'       => $template_id ? get_post_status( $template_id ) : null,
		'template_language'     => $template_id ? pll_get_post_language( $template_id, 'slug' ) : null,
		'template_elements'     => is_array( $elements ) ? count( $elements ) : 0,
		'active_template_trace' => $GLOBALS['bemke_child_preview_template_trace'] ?? array(),
	);

	echo '<pre style="position:fixed;z-index:2147483647;right:12px;bottom:12px;max-width:min(720px,90vw);max-height:55vh;overflow:auto;padding:16px;background:#fff;color:#111;border:3px solid #c00;box-shadow:0 3px 20px #0007;font:12px/1.4 monospace;white-space:pre-wrap">';
	echo esc_html( wp_json_encode( $details, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE ) );
	echo '</pre>';
}
