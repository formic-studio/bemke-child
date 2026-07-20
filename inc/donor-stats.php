<?php
/**
 * Repeatable donor content powered by Carbon Fields.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'carbon_fields_register_fields', 'bemke_child_register_donor_stats_fields' );
add_action( 'carbon_fields_register_fields', 'bemke_child_register_donor_quote_fields' );
add_filter( 'bricks/code/echo_function_names', 'bemke_child_allow_donor_stats_echo_function' );

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
							'Dodaj dowolną liczbę kafelków i ustaw ich kolejność metodą przeciągnij i upuść.',
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
 * Register the repeatable quotes metabox for donor posts.
 */
function bemke_child_register_donor_quote_fields() {
	if (
		! class_exists( '\Carbon_Fields\Container' ) ||
		! class_exists( '\Carbon_Fields\Field' )
	) {
		return;
	}

	\Carbon_Fields\Container::make(
		'post_meta',
		__( 'Darczyńcy – cytaty', 'bemke-child' )
	)
		->where( 'post_type', '=', 'darczynca' )
		->set_context( 'normal' )
		->set_priority( 'high' )
		->add_fields(
			array(
				\Carbon_Fields\Field::make(
					'complex',
					'bemke_donor_quotes',
					__( 'Cytaty', 'bemke-child' )
				)
					->set_help_text(
						__(
							'Dodaj maksymalnie 6 cytatów i ustaw ich kolejność metodą przeciągnij i upuść.',
							'bemke-child'
						)
					)
					->setup_labels(
						array(
							'plural_name'   => __( 'Cytaty', 'bemke-child' ),
							'singular_name' => __( 'Cytat', 'bemke-child' ),
						)
					)
					->set_max( 6 )
					->set_collapsed( true )
					->set_header_template(
						'<% if (bemke_donor_quote_name) { %><%- bemke_donor_quote_name %><% } else { %>Cytat <%- $_index + 1 %><% } %>'
					)
					->add_fields(
						array(
							\Carbon_Fields\Field::make(
								'rich_text',
								'bemke_donor_quote_text',
								__( 'Cytat', 'bemke-child' )
							)
								->set_required( true ),
							\Carbon_Fields\Field::make(
								'text',
								'bemke_donor_quote_name',
								__( 'Imię i nazwisko', 'bemke-child' )
							)
								->set_required( true )
								->set_width( 50 ),
							\Carbon_Fields\Field::make(
								'text',
								'bemke_donor_quote_position',
								__( 'Pozycja', 'bemke-child' )
							)
								->set_required( true )
								->set_width( 50 ),
							\Carbon_Fields\Field::make(
								'image',
								'bemke_donor_quote_image',
								__( 'Zdjęcie', 'bemke-child' )
							)
								->set_help_text(
									__( 'Najlepiej użyć zdjęcia w proporcji 4:3.', 'bemke-child' )
								)
								->set_value_type( 'id' )
								->set_required( true ),
						)
					),
			)
		);
}

/**
 * Allow Bricks to call donor data providers through echo tags.
 *
 * @param mixed $function_names Function names already allowed by Bricks.
 * @return array<int, string>
 */
function bemke_child_allow_donor_stats_echo_function( $function_names = array() ) {
	if ( ! is_array( $function_names ) ) {
		$function_names = array();
	}

	$donor_function_names = array(
		'bemke_child_get_donor_stats_for_bricks',
		'bemke_child_get_donor_quotes_for_bricks',
		'bemke_child_get_donor_video_source_for_bricks',
		'bemke_child_get_donor_video_file_for_bricks',
		'bemke_child_get_donor_video_youtube_url_for_bricks',
	);

	return array_values(
		array_unique( array_merge( $function_names, $donor_function_names ) )
	);
}

/**
 * Return the current donor's repeatable statistics for a Bricks Array Query.
 *
 * This function only reads Carbon Fields data. It does not render or modify
 * any front-end markup.
 *
 * @param int|string $post_id Donor post ID, usually supplied by {post_id}.
 * @return array<int, array<string, mixed>>
 */
function bemke_child_get_donor_stats_for_bricks( $post_id = 0 ) {
	if ( ! function_exists( 'carbon_get_post_meta' ) ) {
		return array();
	}

	$post_id = absint( $post_id );

	if ( ! $post_id || 'darczynca' !== get_post_type( $post_id ) ) {
		$queried_post_id = get_queried_object_id();

		if (
			$queried_post_id &&
			'darczynca' === get_post_type( $queried_post_id )
		) {
			$post_id = $queried_post_id;
		}
	}

	if ( ! $post_id || 'darczynca' !== get_post_type( $post_id ) ) {
		return array();
	}

	$stats = carbon_get_post_meta( $post_id, 'bemke_donor_stats' );

	return is_array( $stats ) ? array_values( $stats ) : array();
}

/**
 * Return the current donor's repeatable quotes for a Bricks Array Query.
 *
 * This function only reads Carbon Fields data. It does not render or modify
 * any front-end markup.
 *
 * @param int|string $post_id Donor post ID, usually supplied by {post_id}.
 * @return array<int, array<string, mixed>>
 */
function bemke_child_get_donor_quotes_for_bricks( $post_id = 0 ) {
	if ( ! function_exists( 'carbon_get_post_meta' ) ) {
		return array();
	}

	$post_id = absint( $post_id );

	if ( ! $post_id || 'darczynca' !== get_post_type( $post_id ) ) {
		$queried_post_id = get_queried_object_id();

		if (
			$queried_post_id &&
			'darczynca' === get_post_type( $queried_post_id )
		) {
			$post_id = $queried_post_id;
		}
	}

	if ( ! $post_id || 'darczynca' !== get_post_type( $post_id ) ) {
		return array();
	}

	$quotes = carbon_get_post_meta( $post_id, 'bemke_donor_quotes' );

	return is_array( $quotes ) ? array_values( $quotes ) : array();
}
