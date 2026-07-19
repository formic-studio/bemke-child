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
