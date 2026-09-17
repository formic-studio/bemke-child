<?php
/** Show translated dynamic content in English page previews while it remains in draft. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'bricks/posts/query_vars', 'bemke_child_preview_english_strategy_slides', 10, 4 );
add_filter( 'bricks/posts/query_vars', 'bemke_child_preview_english_job_offers', 10, 4 );

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
