<?php
/**
 * Repeatable Foundation document lists powered by Carbon Fields.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'carbon_fields_register_fields',
	'bemke_child_register_foundation_document_fields'
);
add_filter(
	'bricks/code/echo_function_names',
	'bemke_child_allow_foundation_documents_echo_function',
	20
);

/**
 * Return the configured Foundation document sections.
 *
 * @return array<string, array{field: string, title: string}>
 */
function bemke_child_get_foundation_document_sections() {
	return array(
		'statut'            => array(
			'field' => 'bemke_foundation_statute_documents',
			'title' => __( 'Statut i pozostałe dokumenty', 'bemke-child' ),
		),
		'merytoryczne'      => array(
			'field' => 'bemke_foundation_substantive_reports',
			'title' => __( 'Sprawozdania merytoryczne', 'bemke-child' ),
		),
		'finansowe'         => array(
			'field' => 'bemke_foundation_financial_reports',
			'title' => __( 'Sprawozdania finansowe', 'bemke-child' ),
		),
		'listy_darczyncow' => array(
			'field' => 'bemke_foundation_donor_lists',
			'title' => __( 'Listy darczyńców', 'bemke-child' ),
		),
	);
}

/**
 * Register four independent, unlimited document repeaters.
 */
function bemke_child_register_foundation_document_fields() {
	if (
		! class_exists( '\Carbon_Fields\Container' ) ||
		! class_exists( '\Carbon_Fields\Field' )
	) {
		return;
	}

	foreach ( bemke_child_get_foundation_document_sections() as $section ) {
		\Carbon_Fields\Container::make(
			'post_meta',
			sprintf(
				/* translators: %s: Foundation document section name. */
				__( 'Dokumenty Fundacji – %s', 'bemke-child' ),
				$section['title']
			)
		)
			->where( 'post_type', '=', 'dokumenty-fundacja' )
			->set_context( 'normal' )
			->set_priority( 'high' )
			->add_fields(
				array(
					\Carbon_Fields\Field::make(
						'complex',
						$section['field'],
						$section['title']
					)
						->set_help_text(
							__(
								'Dodaj dowolną liczbę dokumentów i ustaw ich kolejność metodą przeciągnij i upuść.',
								'bemke-child'
							)
						)
						->setup_labels(
							array(
								'plural_name'   => __( 'Dokumenty', 'bemke-child' ),
								'singular_name' => __( 'Dokument', 'bemke-child' ),
							)
						)
						->set_collapsed( true )
						->set_header_template(
							'<% if (bemke_foundation_document_title) { %><%- bemke_foundation_document_title %><% } else { %>Dokument <%- $_index + 1 %><% } %>'
						)
						->add_fields(
							array(
								\Carbon_Fields\Field::make(
									'text',
									'bemke_foundation_document_title',
									__( 'Nazwa dokumentu', 'bemke-child' )
								)
									->set_help_text(
										__(
											'Nazwa wyświetlana na stronie, np. „Lista darczyńców 2025”.',
											'bemke-child'
										)
									)
									->set_required( true )
									->set_width( 65 ),
								\Carbon_Fields\Field::make(
									'file',
									'bemke_foundation_document_file',
									__( 'Plik do pobrania', 'bemke-child' )
								)
									->set_value_type( 'id' )
									->set_required( true )
									->set_width( 35 ),
							)
						),
				)
			);
	}
}

/**
 * Allow Bricks to call the Foundation document data provider.
 *
 * @param mixed $function_names Function names already allowed by Bricks.
 * @return array<int, string>
 */
function bemke_child_allow_foundation_documents_echo_function( $function_names = array() ) {
	if ( ! is_array( $function_names ) ) {
		$function_names = array();
	}

	$function_names[] = 'bemke_child_get_foundation_documents_for_bricks';

	return array_values( array_unique( $function_names ) );
}

/**
 * Resolve the current Foundation document post ID.
 *
 * @param int|string $post_id Post ID, usually supplied by {post_id}.
 * @return int
 */
function bemke_child_resolve_foundation_document_post_id( $post_id = 0 ) {
	$post_id = absint( $post_id );

	if ( $post_id && 'dokumenty-fundacja' === get_post_type( $post_id ) ) {
		return $post_id;
	}

	$queried_post_id = get_queried_object_id();

	if (
		$queried_post_id &&
		'dokumenty-fundacja' === get_post_type( $queried_post_id )
	) {
		return absint( $queried_post_id );
	}

	return 0;
}

/**
 * Return one Foundation document section for a Bricks Array Query.
 *
 * Each result contains the stored attachment ID and a resolved file URL.
 * This function only reads metadata and does not render front-end markup.
 *
 * @param string     $section_key Section key: statut, merytoryczne, finansowe
 *                                or listy_darczyncow.
 * @param int|string $post_id     Foundation document post ID.
 * @return array<int, array<string, mixed>>
 */
function bemke_child_get_foundation_documents_for_bricks(
	$section_key = '',
	$post_id = 0
) {
	if ( ! function_exists( 'carbon_get_post_meta' ) ) {
		return array();
	}

	$sections = bemke_child_get_foundation_document_sections();

	if ( ! isset( $sections[ $section_key ] ) ) {
		return array();
	}

	$post_id = bemke_child_resolve_foundation_document_post_id( $post_id );

	if ( ! $post_id ) {
		return array();
	}

	$documents = carbon_get_post_meta(
		$post_id,
		$sections[ $section_key ]['field']
	);

	if ( ! is_array( $documents ) ) {
		return array();
	}

	return array_values(
		array_map(
			function ( $document ) {
				$file_id = isset( $document['bemke_foundation_document_file'] )
					? absint( $document['bemke_foundation_document_file'] )
					: 0;
				$file_url = $file_id ? wp_get_attachment_url( $file_id ) : '';

				$document['bemke_foundation_document_file'] = $file_id;
				$document['bemke_foundation_document_url']  = $file_url
					? $file_url
					: '';

				return $document;
			},
			$documents
		)
	);
}
