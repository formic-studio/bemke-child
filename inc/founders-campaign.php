<?php
/**
 * Founders Campaign progress settings and frontend data.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BEMKE_FOUNDERS_CAMPAIGN_GOAL', 200000000 );
define( 'BEMKE_FOUNDERS_CAMPAIGN_DEFAULT_AMOUNT', 160000000 );

add_action(
	'carbon_fields_register_fields',
	'bemke_child_register_founders_campaign_fields'
);
add_action(
	'wp_enqueue_scripts',
	'bemke_child_add_founders_campaign_frontend_data',
	21
);

/**
 * Register the collected amount in the WordPress settings area.
 */
function bemke_child_register_founders_campaign_fields() {
	if (
		! class_exists( '\Carbon_Fields\Container' ) ||
		! class_exists( '\Carbon_Fields\Field' )
	) {
		return;
	}

	\Carbon_Fields\Container::make(
		'theme_options',
		__( 'Kampania Założycielska', 'bemke-child' )
	)
		->set_page_parent( 'options-general.php' )
		->set_page_file( 'bemke-founders-campaign' )
		->add_fields(
			array(
				\Carbon_Fields\Field::make(
					'text',
					'bemke_founders_campaign_amount',
					__( 'Zebrana kwota (PLN)', 'bemke-child' )
				)
					->set_attribute( 'type', 'number' )
					->set_attribute( 'min', '0' )
					->set_attribute(
						'max',
						(string) BEMKE_FOUNDERS_CAMPAIGN_GOAL
					)
					->set_attribute( 'step', '1' )
					->set_default_value(
						(string) BEMKE_FOUNDERS_CAMPAIGN_DEFAULT_AMOUNT
					)
					->set_help_text(
						__(
							'Wpisz pełną kwotę w złotówkach, bez spacji i skrótu „mln”, np. 160000000. Pasek jest liczony względem stałego celu 200 000 000 PLN.',
							'bemke-child'
						)
					)
					->set_required( true ),
			)
		);
}

/**
 * Return the saved amount, constrained to the campaign scale.
 *
 * @return int
 */
function bemke_child_get_founders_campaign_amount() {
	$amount = BEMKE_FOUNDERS_CAMPAIGN_DEFAULT_AMOUNT;

	if ( function_exists( 'carbon_get_theme_option' ) ) {
		$saved_amount = carbon_get_theme_option(
			'bemke_founders_campaign_amount'
		);

		if ( is_numeric( $saved_amount ) ) {
			$amount = (int) round( (float) $saved_amount );
		}
	}

	return min(
		BEMKE_FOUNDERS_CAMPAIGN_GOAL,
		max( 0, $amount )
	);
}

/**
 * Pass the campaign amounts to the progress animation module.
 */
function bemke_child_add_founders_campaign_frontend_data() {
	if ( ! wp_script_is( 'bemke-child-main', 'enqueued' ) ) {
		return;
	}

	wp_localize_script(
		'bemke-child-main',
		'bemkeFoundersCampaign',
		array(
			'currentAmount' => bemke_child_get_founders_campaign_amount(),
			'goalAmount'    => BEMKE_FOUNDERS_CAMPAIGN_GOAL,
		)
	);
}
