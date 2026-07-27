<?php
/**
 * Founders Campaign progress settings and frontend data.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BEMKE_FOUNDERS_CAMPAIGN_DEFAULT_GOAL', 200000000 );
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
					->set_attribute( 'step', '1' )
					->set_default_value(
						(string) BEMKE_FOUNDERS_CAMPAIGN_DEFAULT_AMOUNT
					)
					->set_help_text(
						__(
							'Wpisz pełną kwotę w złotówkach, bez spacji i skrótu „mln”, np. 160000000.',
							'bemke-child'
						)
					)
					->set_width( 50 )
					->set_required( true ),
				\Carbon_Fields\Field::make(
					'text',
					'bemke_founders_campaign_goal',
					__( 'Kwota docelowa (PLN)', 'bemke-child' )
				)
					->set_attribute( 'type', 'number' )
					->set_attribute( 'min', '1' )
					->set_attribute( 'step', '1' )
					->set_default_value(
						(string) BEMKE_FOUNDERS_CAMPAIGN_DEFAULT_GOAL
					)
					->set_help_text(
						__(
							'Wpisz pełną kwotę celu w złotówkach, np. 200000000. Ta wartość odpowiada 100% skali.',
							'bemke-child'
						)
					)
					->set_width( 50 )
					->set_required( true ),
			)
		);
}

/**
 * Return the saved collected amount.
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

	return max( 0, $amount );
}

/**
 * Return the saved campaign goal.
 *
 * @return int
 */
function bemke_child_get_founders_campaign_goal() {
	$goal = BEMKE_FOUNDERS_CAMPAIGN_DEFAULT_GOAL;

	if ( function_exists( 'carbon_get_theme_option' ) ) {
		$saved_goal = carbon_get_theme_option(
			'bemke_founders_campaign_goal'
		);

		if ( is_numeric( $saved_goal ) && (float) $saved_goal > 0 ) {
			$goal = (int) round( (float) $saved_goal );
		}
	}

	return max( 1, $goal );
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
			'goalAmount'    => bemke_child_get_founders_campaign_goal(),
		)
	);
}
