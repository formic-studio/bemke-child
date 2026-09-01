<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BEMKE_GETRESPONSE_SOURCE_FORM_ID          = 'afpmhc';
const BEMKE_GETRESPONSE_EMBED_FORM_ID           = '49910a9d-b11c-4c4c-a31e-163faf64e218';
const BEMKE_GETRESPONSE_EMBED_VARIANT           = '0';
const BEMKE_GETRESPONSE_WEB_CONNECT_URL         = 'https://an.gr-wcon.com/script/f28d4afb-4b5a-4a57-a407-10ffa90942ba/ga.js';
const BEMKE_GETRESPONSE_API_URL                 = 'https://api.getresponse.com/v3';
const BEMKE_GETRESPONSE_API_KEY_OPTION          = 'bemke_getresponse_api_key';
const BEMKE_GETRESPONSE_API_MODE_OPTION         = 'bemke_getresponse_api_mode_enabled';
const BEMKE_GETRESPONSE_LAST_RESULT_OPTION      = 'bemke_getresponse_last_result';
const BEMKE_GETRESPONSE_TARGET_CAMPAIGN_ID      = 'XyxQq';
const BEMKE_GETRESPONSE_CONSENT_ID              = 'QrCz';
const BEMKE_GETRESPONSE_CONSENT_VERSION_ID      = 'IEAp';

add_action( 'admin_menu', 'bemke_getresponse_register_settings_page' );
add_action( 'admin_init', 'bemke_getresponse_handle_settings_save' );
add_action( 'wp_head', 'bemke_getresponse_print_web_connect', 20 );
add_filter( 'bricks/frontend/render_data', 'bemke_getresponse_render_native_form', 10, 3 );
add_action( 'bricks/form/custom_action', 'bemke_getresponse_handle_form_submission' );

/**
 * Register the integration settings without changing the current frontend mode.
 */
function bemke_getresponse_register_settings_page() {
	add_options_page(
		'Bemke GetResponse',
		'Bemke GetResponse',
		'manage_options',
		'bemke-getresponse',
		'bemke_getresponse_render_settings_page'
	);
}

/**
 * Save the API key and switch to the custom Bricks form only after validation.
 */
function bemke_getresponse_handle_settings_save() {
	if ( ! is_admin() || ! current_user_can( 'manage_options' ) || ! isset( $_POST['bemke_getresponse_settings_nonce'] ) ) {
		return;
	}

	check_admin_referer( 'bemke_save_getresponse_settings', 'bemke_getresponse_settings_nonce' );

	if ( isset( $_POST['bemke_clear_getresponse_api_key'] ) ) {
		delete_option( BEMKE_GETRESPONSE_API_KEY_OPTION );
		update_option( BEMKE_GETRESPONSE_API_MODE_OPTION, '0', false );
		bemke_getresponse_redirect_to_settings( 'cleared' );
	}

	$new_api_key = isset( $_POST['bemke_getresponse_api_key'] )
		? bemke_getresponse_normalize_api_key( (string) wp_unslash( $_POST['bemke_getresponse_api_key'] ) )
		: '';

	if ( '' !== $new_api_key && ! bemke_getresponse_has_constant_api_key() ) {
		update_option( BEMKE_GETRESPONSE_API_KEY_OPTION, $new_api_key, false );
	}

	$enable_api_mode = isset( $_POST['bemke_getresponse_api_mode_enabled'] );
	$api_key         = bemke_getresponse_get_api_key();

	if ( ! $enable_api_mode ) {
		update_option( BEMKE_GETRESPONSE_API_MODE_OPTION, '0', false );
		bemke_getresponse_redirect_to_settings( 'disabled' );
	}

	if ( '' === $api_key ) {
		update_option( BEMKE_GETRESPONSE_API_MODE_OPTION, '0', false );
		bemke_getresponse_store_last_result(
			array(
				'status'  => 'configuration_error',
				'message' => 'Brak klucza API.',
			)
		);
		bemke_getresponse_redirect_to_settings( 'missing_key' );
	}

	$validation = bemke_getresponse_validate_campaign( $api_key );

	if ( is_wp_error( $validation ) ) {
		$error_data = $validation->get_error_data();
		update_option( BEMKE_GETRESPONSE_API_MODE_OPTION, '0', false );
		bemke_getresponse_store_last_result(
			array(
				'status'      => 'configuration_error',
				'http_status' => is_scalar( $error_data ) ? (string) $error_data : '',
				'message'     => $validation->get_error_message(),
			)
		);
		bemke_getresponse_redirect_to_settings( 'validation_error' );
	}

	update_option( BEMKE_GETRESPONSE_API_MODE_OPTION, '1', false );
	bemke_getresponse_redirect_to_settings( 'enabled' );
}

/**
 * Redirect after an admin settings action.
 */
function bemke_getresponse_redirect_to_settings( $status ) {
	$redirect_url = add_query_arg(
		array(
			'page'                     => 'bemke-getresponse',
			'bemke_getresponse_status' => sanitize_key( $status ),
		),
		admin_url( 'options-general.php' )
	);

	wp_safe_redirect( $redirect_url );
	exit;
}

/**
 * Render the switch and diagnostics for the integration.
 */
function bemke_getresponse_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$has_constant_api_key = bemke_getresponse_has_constant_api_key();
	$has_option_api_key   = '' !== (string) get_option( BEMKE_GETRESPONSE_API_KEY_OPTION, '' );
	$api_mode_enabled     = bemke_getresponse_is_api_mode_enabled();
	$last_result          = get_option( BEMKE_GETRESPONSE_LAST_RESULT_OPTION, array() );
	$status               = isset( $_GET['bemke_getresponse_status'] )
		? sanitize_key( (string) wp_unslash( $_GET['bemke_getresponse_status'] ) )
		: '';
	?>
	<div class="wrap">
		<h1>Bemke GetResponse</h1>

		<?php bemke_getresponse_render_settings_notice( $status ); ?>

		<p>Integracja zapisuje własny formularz Bricks do listy <strong>Newsletter Campus Bemke</strong> i przekazuje jedną zgodę newsletterową.</p>

		<table class="form-table" role="presentation">
			<tr>
				<th scope="row">Aktywny formularz</th>
				<td><strong><?php echo esc_html( $api_mode_enabled ? 'Własny formularz Bricks + API' : 'Opublikowany formularz GetResponse (fallback)' ); ?></strong></td>
			</tr>
			<tr>
				<th scope="row">Lista / campaignId</th>
				<td><code><?php echo esc_html( BEMKE_GETRESPONSE_TARGET_CAMPAIGN_ID ); ?></code> — Newsletter Campus Bemke</td>
			</tr>
			<tr>
				<th scope="row">Zgoda newsletterowa</th>
				<td><code><?php echo esc_html( BEMKE_GETRESPONSE_CONSENT_ID ); ?></code> (wersja <code><?php echo esc_html( BEMKE_GETRESPONSE_CONSENT_VERSION_ID ); ?></code>)</td>
			</tr>
			<tr>
				<th scope="row">Payload zgody</th>
				<td><code>consents: [{ consentId: "QrCz", consentGiven: true }]</code></td>
			</tr>
		</table>

		<div class="notice notice-warning inline">
			<p>Tryb API korzysta ze struktury <code>consents</code> wskazanej przez support GetResponse. Po włączeniu wykonaj test na zupełnie nowym adresie e-mail i sprawdź sekcję „Status zgody” kontaktu. Wyłączenie trybu natychmiast przywraca działające osadzenie GetResponse.</p>
		</div>

		<?php if ( is_array( $last_result ) && ! empty( $last_result ) ) : ?>
			<h2>Ostatni wynik API</h2>
			<table class="form-table" role="presentation">
				<tr><th scope="row">Czas</th><td><?php echo esc_html( $last_result['time'] ?? '' ); ?></td></tr>
				<tr><th scope="row">Status</th><td><?php echo esc_html( $last_result['status'] ?? '' ); ?></td></tr>
				<tr><th scope="row">HTTP</th><td><?php echo esc_html( $last_result['http_status'] ?? '' ); ?></td></tr>
				<tr><th scope="row">Kod GetResponse</th><td><?php echo esc_html( $last_result['code'] ?? '' ); ?></td></tr>
				<tr><th scope="row">Komunikat</th><td><code><?php echo esc_html( $last_result['message'] ?? '' ); ?></code></td></tr>
			</table>
		<?php endif; ?>

		<form method="post" action="">
			<?php wp_nonce_field( 'bemke_save_getresponse_settings', 'bemke_getresponse_settings_nonce' ); ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="bemke_getresponse_api_key">Klucz API</label></th>
					<td>
						<input
							type="password"
							id="bemke_getresponse_api_key"
							name="bemke_getresponse_api_key"
							class="regular-text"
							value=""
							placeholder="<?php echo esc_attr( $has_option_api_key ? str_repeat( '*', 24 ) : '' ); ?>"
							autocomplete="new-password"
							<?php disabled( $has_constant_api_key ); ?>
						>
						<p class="description"><?php echo esc_html( $has_constant_api_key ? 'Klucz jest ustawiony w wp-config.php.' : 'Puste pole zachowuje wcześniej zapisany klucz. Klucz nie trafia do kodu strony.' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row">Tryb API</th>
					<td>
						<label for="bemke_getresponse_api_mode_enabled">
							<input type="checkbox" id="bemke_getresponse_api_mode_enabled" name="bemke_getresponse_api_mode_enabled" value="1" <?php checked( $api_mode_enabled ); ?>>
							Włącz własny formularz Bricks i wysyłkę zgody przez API
						</label>
						<p class="description">Przy włączaniu połączenie i lista <code><?php echo esc_html( BEMKE_GETRESPONSE_TARGET_CAMPAIGN_ID ); ?></code> zostaną sprawdzone przed zmianą formularza na stronie.</p>
					</td>
				</tr>
			</table>

			<?php submit_button( 'Zapisz i sprawdź konfigurację' ); ?>

			<?php if ( ! $has_constant_api_key && $has_option_api_key ) : ?>
				<p><button type="submit" name="bemke_clear_getresponse_api_key" value="1" class="button button-secondary">Usuń klucz API i wyłącz tryb API</button></p>
			<?php endif; ?>
		</form>
	</div>
	<?php
}

/**
 * Render a concise settings result notice.
 */
function bemke_getresponse_render_settings_notice( $status ) {
	$notices = array(
		'enabled'          => array( 'success', 'Połączenie działa. Własny formularz i tryb API zostały włączone.' ),
		'disabled'         => array( 'info', 'Tryb API jest wyłączony. Na stronie działa formularz osadzony z GetResponse.' ),
		'cleared'          => array( 'success', 'Klucz API usunięto, a działający formularz GetResponse został przywrócony.' ),
		'missing_key'      => array( 'error', 'Nie można włączyć trybu API bez klucza API.' ),
		'validation_error' => array( 'error', 'GetResponse odrzucił konfigurację. Tryb API nie został włączony; szczegóły są poniżej.' ),
	);

	if ( ! isset( $notices[ $status ] ) ) {
		return;
	}

	list( $type, $message ) = $notices[ $status ];
	printf(
		'<div class="notice notice-%1$s is-dismissible"><p>%2$s</p></div>',
		esc_attr( $type ),
		esc_html( $message )
	);
}

/**
 * Keep the current published GetResponse form as the default fallback.
 */
function bemke_getresponse_print_web_connect() {
	if (
		bemke_getresponse_is_api_mode_enabled() ||
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
		})(window, document, 'script', <?php echo wp_json_encode( BEMKE_GETRESPONSE_WEB_CONNECT_URL ); ?>, 'GrTracking');
	</script>
	<!-- End GetResponse Analytics -->
	<?php
}

/**
 * In fallback mode replace the Bricks form with the published GetResponse form.
 * In API mode return the original Bricks markup and styling unchanged.
 */
function bemke_getresponse_render_native_form( $html, $post = null, $area = null ) {
	unset( $post, $area );

	if (
		bemke_getresponse_is_api_mode_enabled() ||
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

/**
 * Submit the original Bricks form to GetResponse in API mode.
 */
function bemke_getresponse_handle_form_submission( $form ) {
	if ( ! bemke_getresponse_is_api_mode_enabled() ) {
		return;
	}

	$fields = method_exists( $form, 'get_fields' ) ? $form->get_fields() : array();

	if ( ! is_array( $fields ) || ! bemke_getresponse_is_newsletter_form( $fields ) ) {
		return;
	}

	$name    = sanitize_text_field( (string) bemke_getresponse_get_field_value( $fields, array( 'name', 'form-field-name', 'a4f8b2', 'form-field-a4f8b2' ) ) );
	$email   = sanitize_email( (string) bemke_getresponse_get_field_value( $fields, array( 'email', 'form-field-email', 'dba4f2', 'form-field-dba4f2' ) ) );
	$consent = bemke_getresponse_is_checked( bemke_getresponse_get_field_value( $fields, array( 'privacy', 'form-field-privacy' ) ) );

	if ( '' === $name || ! is_email( $email ) ) {
		bemke_getresponse_set_form_result( $form, 'danger', 'Uzupełnij poprawnie imię i nazwisko oraz adres e-mail.' );
		return;
	}

	if ( ! $consent ) {
		bemke_getresponse_set_form_result( $form, 'danger', 'Zaznacz wymaganą zgodę, aby zapisać się do newslettera.' );
		return;
	}

	$response = bemke_getresponse_create_contact(
		array(
			'name'      => $name,
			'email'     => $email,
			'ipAddress' => bemke_getresponse_get_client_ip(),
		),
		bemke_getresponse_get_api_key()
	);

	if ( is_wp_error( $response ) ) {
		bemke_getresponse_store_last_result(
			array(
				'status'  => 'wp_error',
				'message' => $response->get_error_message(),
			)
		);
		error_log( 'Bemke GetResponse error: ' . $response->get_error_message() );
		bemke_getresponse_set_form_result( $form, 'danger', 'Nie udało się zapisać do newslettera. Spróbuj ponownie za chwilę.' );
		return;
	}

	$status_code = (int) wp_remote_retrieve_response_code( $response );

	if ( 202 === $status_code ) {
		bemke_getresponse_store_last_result(
			array(
				'status'      => 'success',
				'http_status' => $status_code,
				'message'     => 'Kontakt i zgoda QrCz zostały przyjęte przez API.',
			)
		);
		bemke_getresponse_set_form_result( $form, 'success', 'Dziękujemy za zapis do newslettera.' );
		return;
	}

	if ( 409 === $status_code ) {
		bemke_getresponse_store_last_response( $response, 'duplicate' );
		bemke_getresponse_set_form_result( $form, 'success', 'Ten adres e-mail jest już zapisany do newslettera.' );
		return;
	}

	bemke_getresponse_store_last_response( $response, 'api_error' );
	$error_message = bemke_getresponse_get_response_error_message( $response );
	error_log( sprintf( 'Bemke GetResponse HTTP %d: %s', $status_code, $error_message ) );
	bemke_getresponse_set_form_result( $form, 'danger', 'Nie udało się zapisać do newslettera. Spróbuj ponownie za chwilę.' );
}

/**
 * Build the exact consent payload supplied by GetResponse support.
 */
function bemke_getresponse_create_contact( array $contact, $api_key ) {
	$body = array(
		'name'     => $contact['name'],
		'email'    => $contact['email'],
		'campaign' => array(
			'campaignId' => BEMKE_GETRESPONSE_TARGET_CAMPAIGN_ID,
		),
		'consents' => array(
			array(
				'consentId'    => BEMKE_GETRESPONSE_CONSENT_ID,
				'consentGiven' => true,
			),
		),
	);

	if ( ! empty( $contact['ipAddress'] ) ) {
		$body['ipAddress'] = $contact['ipAddress'];
	}

	return wp_remote_post(
		BEMKE_GETRESPONSE_API_URL . '/contacts',
		array(
			'timeout' => 15,
			'headers' => bemke_getresponse_api_headers( $api_key, true ),
			'body'    => wp_json_encode( $body ),
		)
	);
}

/**
 * Validate the key and destination list before exposing the custom form.
 */
function bemke_getresponse_validate_campaign( $api_key ) {
	$response = wp_remote_get(
		BEMKE_GETRESPONSE_API_URL . '/campaigns/' . rawurlencode( BEMKE_GETRESPONSE_TARGET_CAMPAIGN_ID ),
		array(
			'timeout' => 15,
			'headers' => bemke_getresponse_api_headers( $api_key ),
		)
	);

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$status_code = (int) wp_remote_retrieve_response_code( $response );

	if ( 200 !== $status_code ) {
		return new WP_Error(
			'bemke_getresponse_invalid_configuration',
			sprintf( 'GetResponse zwrócił HTTP %1$d: %2$s', $status_code, bemke_getresponse_get_response_error_message( $response ) ),
			$status_code
		);
	}

	return true;
}

/**
 * Common authenticated headers. The key never reaches frontend HTML.
 */
function bemke_getresponse_api_headers( $api_key, $json = false ) {
	$headers = array(
		'Accept'       => 'application/json',
		'X-Auth-Token' => 'api-key ' . bemke_getresponse_normalize_api_key( $api_key ),
	);

	if ( $json ) {
		$headers['Content-Type'] = 'application/json';
	}

	return $headers;
}

function bemke_getresponse_is_newsletter_form( array $fields ) {
	$form_id = bemke_getresponse_get_field_value( $fields, array( 'formId', 'form_id' ) );

	if ( null !== $form_id && '' !== (string) $form_id && BEMKE_GETRESPONSE_SOURCE_FORM_ID !== (string) $form_id ) {
		return false;
	}

	$has_email   = null !== bemke_getresponse_get_field_value( $fields, array( 'email', 'form-field-email', 'dba4f2', 'form-field-dba4f2' ) );
	$has_name    = null !== bemke_getresponse_get_field_value( $fields, array( 'name', 'form-field-name', 'a4f8b2', 'form-field-a4f8b2' ) );
	$has_consent = null !== bemke_getresponse_get_field_value( $fields, array( 'privacy', 'form-field-privacy' ) );

	return $has_email && $has_name && $has_consent;
}

function bemke_getresponse_get_field_value( array $fields, array $keys ) {
	foreach ( $keys as $key ) {
		if ( array_key_exists( $key, $fields ) ) {
			return $fields[ $key ];
		}
	}

	return null;
}

function bemke_getresponse_is_checked( $value ) {
	if ( is_array( $value ) ) {
		foreach ( $value as $item ) {
			if ( bemke_getresponse_is_checked( $item ) ) {
				return true;
			}
		}

		return false;
	}

	$normalized = strtolower( trim( (string) $value ) );

	return '' !== $normalized && ! in_array( $normalized, array( '0', 'no', 'off', 'false', 'nie' ), true );
}

function bemke_getresponse_has_constant_api_key() {
	return defined( 'BEMKE_GETRESPONSE_API_KEY' ) && '' !== trim( (string) BEMKE_GETRESPONSE_API_KEY );
}

function bemke_getresponse_get_api_key() {
	if ( bemke_getresponse_has_constant_api_key() ) {
		return bemke_getresponse_normalize_api_key( (string) BEMKE_GETRESPONSE_API_KEY );
	}

	return bemke_getresponse_normalize_api_key( (string) get_option( BEMKE_GETRESPONSE_API_KEY_OPTION, '' ) );
}

function bemke_getresponse_is_api_mode_enabled() {
	return '1' === (string) get_option( BEMKE_GETRESPONSE_API_MODE_OPTION, '0' ) && '' !== bemke_getresponse_get_api_key();
}

function bemke_getresponse_normalize_api_key( $api_key ) {
	$api_key = trim( (string) $api_key, " \t\n\r\0\x0B\"'" );

	if ( 0 === stripos( $api_key, 'api-key ' ) ) {
		$api_key = trim( substr( $api_key, 8 ) );
	}

	if ( 0 === stripos( $api_key, 'bearer ' ) ) {
		$api_key = trim( substr( $api_key, 7 ) );
	}

	return $api_key;
}

function bemke_getresponse_get_client_ip() {
	$remote_addr = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( (string) wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';

	return filter_var( $remote_addr, FILTER_VALIDATE_IP ) ? $remote_addr : '';
}

function bemke_getresponse_get_response_error_message( $response ) {
	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );

	if ( is_array( $body ) && ! empty( $body['message'] ) ) {
		return sanitize_text_field( (string) $body['message'] );
	}

	return 'Nieznany błąd GetResponse.';
}

function bemke_getresponse_store_last_response( $response, $status ) {
	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );

	if ( ! is_array( $body ) ) {
		$body = array();
	}

	bemke_getresponse_store_last_result(
		array(
			'status'      => $status,
			'http_status' => (int) wp_remote_retrieve_response_code( $response ),
			'code'        => sanitize_text_field( (string) ( $body['code'] ?? '' ) ),
			'message'     => sanitize_text_field( (string) ( $body['message'] ?? 'Nieznany błąd GetResponse.' ) ),
		)
	);
}

function bemke_getresponse_store_last_result( array $result ) {
	$result = wp_parse_args(
		$result,
		array(
			'time'        => current_time( 'mysql' ),
			'status'      => '',
			'http_status' => '',
			'code'        => '',
			'message'     => '',
		)
	);

	update_option(
		BEMKE_GETRESPONSE_LAST_RESULT_OPTION,
		array(
			'time'        => sanitize_text_field( (string) $result['time'] ),
			'status'      => sanitize_text_field( (string) $result['status'] ),
			'http_status' => sanitize_text_field( (string) $result['http_status'] ),
			'code'        => sanitize_text_field( (string) $result['code'] ),
			'message'     => sanitize_text_field( (string) $result['message'] ),
		),
		false
	);
}

function bemke_getresponse_set_form_result( $form, $type, $message ) {
	if ( ! method_exists( $form, 'set_result' ) ) {
		return;
	}

	$form->set_result(
		array(
			'type'    => $type,
			'message' => esc_html( $message ),
		)
	);
}
