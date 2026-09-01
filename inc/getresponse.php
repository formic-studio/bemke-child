<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BEMKE_GETRESPONSE_SOURCE_FORM_ID  = 'afpmhc';
const BEMKE_GETRESPONSE_EMBED_FORM_ID   = 'edb4255b-4abf-4da5-8ee1-dce33fad4220';
const BEMKE_GETRESPONSE_EMBED_VARIANT   = '0';
const BEMKE_GETRESPONSE_WEB_CONNECT_URL = 'https://an.gr-wcon.com/script/f28d4afb-4b5a-4a57-a407-10ffa90942ba/ga.js';
const BEMKE_GETRESPONSE_CACHE_ID_OPTION = 'bemke_getresponse_embed_cache_id';

add_action( 'init', 'bemke_getresponse_maybe_purge_cached_embed', 20 );
add_action( 'wp_head', 'bemke_getresponse_print_web_connect', 20 );
add_filter( 'bricks/frontend/render_data', 'bemke_getresponse_render_native_form', 10, 3 );

/**
 * Purge the cached homepage once whenever the embedded form ID changes.
 */
function bemke_getresponse_maybe_purge_cached_embed() {
	$cached_embed_id = (string) get_option( BEMKE_GETRESPONSE_CACHE_ID_OPTION, '' );

	if ( BEMKE_GETRESPONSE_EMBED_FORM_ID === $cached_embed_id ) {
		return;
	}

	if ( has_action( 'litespeed_purge_url' ) ) {
		do_action( 'litespeed_purge_url', home_url( '/' ) );
	}

	update_option( BEMKE_GETRESPONSE_CACHE_ID_OPTION, BEMKE_GETRESPONSE_EMBED_FORM_ID, false );
}

/**
 * Load GetResponse Web Connect exactly once on the public homepage.
 *
 * The published GetResponse form owns its fields, validation, destination list
 * and recorded GDPR consent.
 */
function bemke_getresponse_print_web_connect() {
	if (
		is_admin() ||
		! is_front_page() ||
		( function_exists( 'bemke_child_is_bricks_builder_request' ) && bemke_child_is_bricks_builder_request() )
	) {
		return;
	}
	?>
	<!-- GetResponse Analytics -->
	<script type="text/javascript">
		(function(m, o, n, t, e, r, _) {
			m['__GetResponseAnalyticsObject'] = e;
			m[e] = m[e] || function() {
				(m[e].q = m[e].q || []).push(arguments);
			};
			r = o.createElement(n);
			_ = o.getElementsByTagName(n)[0];
			r.async = 1;
			r.src = t;
			r.setAttribute('crossorigin', 'use-credentials');
			_.parentNode.insertBefore(r, _);
		})(
			window,
			document,
			'script',
			<?php echo wp_json_encode( BEMKE_GETRESPONSE_WEB_CONNECT_URL ); ?>,
			'GrTracking'
		);
	</script>
	<!-- End GetResponse Analytics -->
	<?php
}

/**
 * Replace only the homepage Bricks newsletter element with the published form.
 *
 * Its visual design and consent configuration are managed in GetResponse.
 */
function bemke_getresponse_render_native_form( $html, $post = null, $area = null ) {
	unset( $post, $area );

	if (
		is_admin() ||
		! is_front_page() ||
		( function_exists( 'bemke_child_is_bricks_builder_request' ) && bemke_child_is_bricks_builder_request() ) ||
		! is_string( $html ) ||
		false === strpos( $html, 'brxe-' . BEMKE_GETRESPONSE_SOURCE_FORM_ID )
	) {
		return $html;
	}

	$native_form = sprintf(
		'<div id="brxe-%1$s" class="bemke-getresponse-native-form"><getresponse-form form-id="%2$s" e="%3$s"></getresponse-form></div>',
		esc_attr( BEMKE_GETRESPONSE_SOURCE_FORM_ID ),
		esc_attr( BEMKE_GETRESPONSE_EMBED_FORM_ID ),
		esc_attr( BEMKE_GETRESPONSE_EMBED_VARIANT )
	);
	$form_pattern = '/<form\b(?=[^>]*\bid\s*=\s*(["\'])brxe-' . preg_quote( BEMKE_GETRESPONSE_SOURCE_FORM_ID, '/' ) . '\1)[^>]*>.*?<\/form>/is';
	$updated_html = preg_replace( $form_pattern, $native_form, $html, 1 );

	return null === $updated_html ? $html : $updated_html;
}
