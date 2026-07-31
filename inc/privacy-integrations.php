<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BEMKE_COOKIEBOT_MARKETING_CATEGORY = 'marketing';

add_filter( 'script_loader_tag', 'bemke_child_apply_cookiebot_script_markup', 100, 3 );

/**
 * Keep the site's own, tracking-free bundle available and manually gate the
 * Google Maps API. Cookiebot's automatic mode respects this markup too, which
 * makes the transition to manual blocking safe.
 */
function bemke_child_apply_cookiebot_script_markup( $tag, $handle, $src = '' ) {
	$original_tag = $tag;

	if ( 'bemke-child-main' === $handle ) {
		$tag = bemke_child_set_script_type( $tag, 'module' );

		if ( bemke_child_cookiebot_is_active() ) {
			$tag = bemke_child_add_script_data_attribute(
				$tag,
				'data-cookieconsent',
				'ignore'
			);
		}

		return $tag;
	}

	if ( ! bemke_child_cookiebot_is_active() ) {
		return $tag;
	}

	$is_google_maps = 'bricks-google-maps' === $handle
		|| false !== stripos( (string) $src, 'maps.googleapis.com/maps/api/js' )
		|| false !== stripos( (string) $tag, 'maps.googleapis.com/maps/api/js' );

	if ( ! $is_google_maps ) {
		return $tag;
	}

	$tag = preg_replace(
		'/\s+type\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)/i',
		'',
		$tag,
		1
	);

	if ( null === $tag ) {
		return $original_tag;
	}

	$tag = bemke_child_add_script_data_attribute(
		$tag,
		'data-cookieconsent',
		BEMKE_COOKIEBOT_MARKETING_CATEGORY
	);
	$tag = bemke_child_add_script_data_attribute(
		$tag,
		'data-bemke-consent-service',
		'google-maps'
	);

	return preg_replace( '/<script\b/i', '<script type="text/plain"', $tag, 1 ) ?: $tag;
}

function bemke_child_set_script_type( $tag, $type ) {
	$updated_tag = preg_replace(
		'/\s+type\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)/i',
		'',
		$tag,
		1
	);

	if ( null === $updated_tag ) {
		return $tag;
	}

	$updated_tag = preg_replace(
		'/<script\b/i',
		'<script type="' . esc_attr( $type ) . '"',
		$updated_tag,
		1
	);

	return null === $updated_tag ? $tag : $updated_tag;
}

function bemke_child_cookiebot_is_active() {
	return function_exists( 'cookiebot_active' ) && cookiebot_active();
}

function bemke_child_add_script_data_attribute( $tag, $attribute, $value ) {
	if ( false !== stripos( $tag, $attribute . '=' ) ) {
		return $tag;
	}

	$updated_tag = preg_replace(
		'/<script\b/i',
		sprintf(
			'<script %1$s="%2$s"',
			esc_attr( $attribute ),
			esc_attr( $value )
		),
		$tag,
		1
	);

	return null === $updated_tag ? $tag : $updated_tag;
}

/**
 * Use YouTube's privacy-enhanced host for current Bricks lazy embeds and for
 * any regular YouTube iframe added later. Direct iframes are converted to
 * Cookiebot's manual iframe markup; Bricks lazy embeds are handled on click by
 * the child-theme JavaScript because Bricks uses data-iframe-src internally.
 */
function bemke_child_prepare_manual_consent_markup( $html ) {
	if ( ! is_string( $html ) || '' === $html || ! bemke_child_cookiebot_is_active() ) {
		return $html;
	}

	$html = str_ireplace(
		array(
			'https://www.youtube.com/embed/',
			'https://youtube.com/embed/',
		),
		'https://www.youtube-nocookie.com/embed/',
		$html
	);

	$lazy_youtube_pattern = '/\sdata-iframe-src\s*=\s*(["\'])(https:\/\/www\.youtube-nocookie\.com\/embed\/[^"\']*)\1/i';
	$updated_html         = preg_replace(
		$lazy_youtube_pattern,
		' data-bemke-cookieblock-iframe-src=$1$2$1 data-cookieconsent="' . BEMKE_COOKIEBOT_MARKETING_CATEGORY . '" data-bemke-consent-service="youtube"',
		$html
	);

	if ( null !== $updated_html ) {
		$html = $updated_html;
	}

	$iframe_pattern = '/<iframe\b(?=[^>]*(?:src|data-cookieblock-src)\s*=\s*(["\'])https:\/\/www\.youtube-nocookie\.com\/embed\/[^"\']*\1)[^>]*>/i';
	$updated_html   = preg_replace_callback(
		$iframe_pattern,
		function ( $matches ) {
			$iframe = $matches[0];

			if ( false === stripos( $iframe, 'data-cookieblock-src=' ) ) {
				$iframe = preg_replace(
					'/\ssrc\s*=\s*(["\'])(https:\/\/www\.youtube-nocookie\.com\/embed\/[^"\']*)\1/i',
					' data-cookieblock-src=$1$2$1',
					$iframe,
					1
				);
			}

			if ( null === $iframe ) {
				return $matches[0];
			}

			if ( false === stripos( $iframe, 'data-cookieconsent=' ) ) {
				$iframe = preg_replace(
					'/<iframe\b/i',
					'<iframe data-cookieconsent="' . BEMKE_COOKIEBOT_MARKETING_CATEGORY . '" data-bemke-consent-service="youtube"',
					$iframe,
					1
				);
			}

			return null === $iframe ? $matches[0] : $iframe;
		},
		$html
	);

	return null === $updated_html ? $html : $updated_html;
}
