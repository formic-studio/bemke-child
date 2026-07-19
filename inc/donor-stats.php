<?php
/**
 * Repeatable donor statistics powered by Carbon Fields.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'carbon_fields_register_fields', 'bemke_child_register_donor_stats_fields' );
add_action( 'init', 'bemke_child_register_donor_stats_shortcode' );

/**
 * Register the repeatable statistics metabox for donor posts.
 */
function bemke_child_register_donor_stats_fields() {
	if (
		! class_exists( '\Carbon_Fields\Container' ) ||
		! class_exists( '\Carbon_Fields\Field' )
	) {
		return;
	}

	\Carbon_Fields\Container::make(
		'post_meta',
		__( 'Darczyńcy – liczby i statystyki', 'bemke-child' )
	)
		->where( 'post_type', '=', 'darczynca' )
		->set_context( 'normal' )
		->set_priority( 'high' )
		->add_fields(
			array(
				\Carbon_Fields\Field::make(
					'complex',
					'bemke_donor_stats',
					__( 'Kafelki z liczbami', 'bemke-child' )
				)
					->set_help_text(
						__(
							'Dodaj dowolną liczbę kafelków i ustaw ich kolejność metodą przeciągnij i upuść. Gdy lista jest pusta, strona zachowuje dotychczasowe kafelki z szablonu.',
							'bemke-child'
						)
					)
					->setup_labels(
						array(
							'plural_name'   => __( 'Kafelki', 'bemke-child' ),
							'singular_name' => __( 'Kafelek', 'bemke-child' ),
						)
					)
					->set_collapsed( true )
					->set_header_template(
						'<% if (bemke_donor_stat_value) { %><%- bemke_donor_stat_value %><% } else { %>Kafelek <%- $_index + 1 %><% } %>'
					)
					->add_fields(
						array(
							\Carbon_Fields\Field::make(
								'text',
								'bemke_donor_stat_value',
								__( 'Liczba', 'bemke-child' )
							)
								->set_help_text(
									__( 'Np. 1600+, 3820 albo 1,5 mln.', 'bemke-child' )
								)
								->set_required( true )
								->set_width( 25 ),
							\Carbon_Fields\Field::make(
								'textarea',
								'bemke_donor_stat_description',
								__( 'Opis', 'bemke-child' )
							)
								->set_rows( 3 )
								->set_required( true )
								->set_width( 75 ),
						)
					),
			)
		);
}

/**
 * Register a shortcode for explicit placement in Bricks when needed.
 */
function bemke_child_register_donor_stats_shortcode() {
	add_shortcode( 'bemke_donor_stats', 'bemke_child_render_donor_stats_shortcode' );
}

/**
 * Render donor statistics through [bemke_donor_stats].
 *
 * @param array<string, mixed> $atts Shortcode attributes.
 * @return string
 */
function bemke_child_render_donor_stats_shortcode( $atts = array() ) {
	$atts = shortcode_atts(
		array(
			'post_id' => 0,
		),
		$atts,
		'bemke_donor_stats'
	);

	$post_id = absint( $atts['post_id'] );

	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	return bemke_child_get_donor_stats_markup( $post_id );
}

/**
 * Fetch complete donor statistic rows.
 *
 * @param int $post_id Donor post ID.
 * @return array<int, array{value: string, description: string}>
 */
function bemke_child_get_donor_stats( $post_id ) {
	if ( ! $post_id || ! function_exists( 'carbon_get_post_meta' ) ) {
		return array();
	}

	$rows = carbon_get_post_meta( $post_id, 'bemke_donor_stats' );

	if ( ! is_array( $rows ) ) {
		return array();
	}

	$stats = array();

	foreach ( $rows as $row ) {
		if ( ! is_array( $row ) ) {
			continue;
		}

		$value       = isset( $row['bemke_donor_stat_value'] )
			? trim( (string) $row['bemke_donor_stat_value'] )
			: '';
		$description = isset( $row['bemke_donor_stat_description'] )
			? trim( (string) $row['bemke_donor_stat_description'] )
			: '';

		if ( '' === $value || '' === $description ) {
			continue;
		}

		$stats[] = array(
			'value'       => $value,
			'description' => $description,
		);
	}

	return $stats;
}

/**
 * Build the front-end grid for donor statistics.
 *
 * @param int $post_id Donor post ID.
 * @return string
 */
function bemke_child_get_donor_stats_markup( $post_id ) {
	$stats = bemke_child_get_donor_stats( $post_id );

	if ( empty( $stats ) ) {
		return '';
	}

	ob_start();
	?>
	<div class="bemke-donor-stats" role="list" aria-label="<?php esc_attr_e( 'Liczby i statystyki', 'bemke-child' ); ?>">
		<?php foreach ( $stats as $stat ) : ?>
			<div class="brxe-block number-card version-red bemke-donor-stat" role="listitem">
				<div class="brxe-text-basic font-f-season-mix number-text font-mobile-h1">
					<?php echo esc_html( $stat['value'] ); ?>
				</div>
				<div class="brxe-text-basic bemke-donor-stat__description">
					<?php echo nl2br( esc_html( $stat['description'] ) ); ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php

	return trim( ob_get_clean() );
}

/**
 * Replace the hard-coded Bricks cards on donor pages when Carbon data exists.
 *
 * Empty Carbon fields deliberately leave the current Bricks content untouched.
 *
 * @param string $html Complete front-end HTML.
 * @return string
 */
function bemke_child_maybe_replace_donor_stats_markup( $html ) {
	if (
		! is_singular( 'darczynca' ) ||
		! function_exists( 'get_queried_object_id' )
	) {
		return $html;
	}

	$markup = bemke_child_get_donor_stats_markup( get_queried_object_id() );

	if ( '' === $markup ) {
		return $html;
	}

	return bemke_child_replace_element_inner_html(
		$html,
		'brxe-iuogje',
		$markup
	);
}

/**
 * Replace the inner HTML of a div without reparsing the complete document.
 *
 * @param string $html       Complete HTML.
 * @param string $element_id Target div ID.
 * @param string $inner_html Replacement markup.
 * @return string
 */
function bemke_child_replace_element_inner_html( $html, $element_id, $inner_html ) {
	$opening_pattern = '/<div\b[^>]*\bid\s*=\s*(["\'])' .
		preg_quote( $element_id, '/' ) .
		'\1[^>]*>/i';

	if (
		! preg_match(
			$opening_pattern,
			$html,
			$opening_match,
			PREG_OFFSET_CAPTURE
		)
	) {
		return $html;
	}

	$opening_tag   = $opening_match[0][0];
	$content_start = $opening_match[0][1] + strlen( $opening_tag );
	$search_offset = $content_start;
	$depth         = 1;

	while (
		preg_match(
			'/<\/?div\b[^>]*>/i',
			$html,
			$tag_match,
			PREG_OFFSET_CAPTURE,
			$search_offset
		)
	) {
		$tag        = $tag_match[0][0];
		$tag_offset = $tag_match[0][1];
		$is_closing = 0 === strpos( $tag, '</' );

		$depth += $is_closing ? -1 : 1;

		if ( 0 === $depth ) {
			return substr( $html, 0, $content_start ) .
				$inner_html .
				substr( $html, $tag_offset );
		}

		$search_offset = $tag_offset + strlen( $tag );
	}

	return $html;
}
