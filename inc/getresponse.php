<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BEMKE_GETRESPONSE_SOURCE_FORM_ID         = 'afpmhc';
const BEMKE_GETRESPONSE_FORM_ENDPOINT          = 'https://app.getresponse.com/add_subscriber.html';
const BEMKE_GETRESPONSE_CAMPAIGN_TOKEN         = 'XyxQq';
const BEMKE_GETRESPONSE_CONSENT_ID             = 'QrCz';
const BEMKE_GETRESPONSE_CONSENT_VERSION_ID     = 'IEAp';
const BEMKE_GETRESPONSE_STATUS_QUERY_PARAMETER = 'newsletter';

add_filter( 'bricks/frontend/render_data', 'bemke_getresponse_render_html_form', 10, 3 );

/**
 * Replace only the homepage Bricks newsletter form with a direct GetResponse
 * HTML form. The visible markup remains under our control, while GetResponse
 * receives the documented campaign and GDPR consent fields.
 */
function bemke_getresponse_render_html_form( $html, $post = null, $area = null ) {
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

	$form_pattern = '/<form\b(?=[^>]*\bid\s*=\s*(["\'])brxe-' . preg_quote( BEMKE_GETRESPONSE_SOURCE_FORM_ID, '/' ) . '\1)[^>]*>.*?<\/form>/is';
	$updated_html = preg_replace( $form_pattern, bemke_getresponse_get_html_form(), $html, 1 );

	return null === $updated_html ? $html : $updated_html;
}

/**
 * Build the form accepted by GetResponse's plain HTML subscription endpoint.
 *
 * If the consent copy changes in GetResponse, its version ID changes too and
 * BEMKE_GETRESPONSE_CONSENT_VERSION_ID must be updated to the active version.
 */
function bemke_getresponse_get_html_form() {
	$consent_field_name = sprintf(
		'webform[consent%s-ver%s]',
		BEMKE_GETRESPONSE_CONSENT_ID,
		BEMKE_GETRESPONSE_CONSENT_VERSION_ID
	);
	$thankyou_url = add_query_arg(
		BEMKE_GETRESPONSE_STATUS_QUERY_PARAMETER,
		'sent',
		home_url( '/' )
	) . '#brxe-afpmhc';
	$status_value = isset( $_GET[ BEMKE_GETRESPONSE_STATUS_QUERY_PARAMETER ] )
		&& is_string( $_GET[ BEMKE_GETRESPONSE_STATUS_QUERY_PARAMETER ] )
		? sanitize_key( wp_unslash( $_GET[ BEMKE_GETRESPONSE_STATUS_QUERY_PARAMETER ] ) )
		: '';
	$is_sent      = 'sent' === $status_value;

	ob_start();
	?>
	<form
		id="brxe-<?php echo esc_attr( BEMKE_GETRESPONSE_SOURCE_FORM_ID ); ?>"
		class="bemke-newsletter-form"
		action="<?php echo esc_url( BEMKE_GETRESPONSE_FORM_ENDPOINT ); ?>"
		method="post"
		accept-charset="utf-8"
	>
		<?php if ( $is_sent ) : ?>
			<div class="bemke-newsletter-form__message" role="status" tabindex="-1">
				Dziękujemy za zapis. Jeśli wymagane jest potwierdzenie, sprawdź swoją skrzynkę e-mail.
			</div>
		<?php endif; ?>

		<div class="bemke-newsletter-form__field">
			<label for="bemke-newsletter-name">IMIĘ I NAZWISKO</label>
			<input
				id="bemke-newsletter-name"
				type="text"
				name="name"
				autocomplete="name"
				required
			>
		</div>

		<div class="bemke-newsletter-form__field">
			<label for="bemke-newsletter-email">E-MAIL *</label>
			<input
				id="bemke-newsletter-email"
				type="email"
				name="email"
				autocomplete="email"
				inputmode="email"
				required
			>
		</div>

		<div class="bemke-newsletter-form__consent">
			<input
				id="bemke-newsletter-consent"
				type="checkbox"
				name="<?php echo esc_attr( $consent_field_name ); ?>"
				value="true"
				required
			>
			<label for="bemke-newsletter-consent">
				Wyrażam zgodę na otrzymywanie wiadomości z aktualnościami oraz ofertą Fundacji Campus Bemke. Oświadczam, że zapoznałam/em się z
				<a href="<?php echo esc_url( home_url( '/polityka-prywatnosci/' ) ); ?>">Polityką Prywatności</a>.
			</label>
		</div>

		<input type="hidden" name="campaign_token" value="<?php echo esc_attr( BEMKE_GETRESPONSE_CAMPAIGN_TOKEN ); ?>">
		<input type="hidden" name="thankyou_url" value="<?php echo esc_url( $thankyou_url ); ?>">
		<input type="hidden" name="start_day" value="0">

		<div class="bemke-newsletter-form__submit">
			<button type="submit">Wyślij</button>
		</div>
	</form>
	<?php

	return trim( (string) ob_get_clean() );
}
