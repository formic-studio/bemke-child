<?php
/**
 * Accessible alternatives for content images rendered by Bricks.
 *
 * Bricks stores part of the image markup in page data, outside this theme. The
 * final-markup pass keeps the alternatives correct for every responsive image
 * size without modifying decorative images, which intentionally retain alt="".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Replace missing or generic alternatives in the final frontend markup.
 *
 * @param string $html Complete frontend response markup.
 * @return string
 */
function bemke_child_prepare_image_alternatives( $html ) {
	$alternatives = bemke_child_get_image_alternatives();
	$donor_name   = '';

	if ( is_singular( 'darczynca' ) ) {
		$donor_id   = get_queried_object_id();
		$donor_name = $donor_id ? get_the_title( $donor_id ) : '';
		$donor_name = trim( wp_strip_all_tags( $donor_name ) );
	}

	$updated_html = preg_replace_callback(
		'/<img\b[^>]*>/i',
		static function ( $matches ) use ( $alternatives, $donor_name ) {
			$image_tag = $matches[0];
			$alt_text  = '';

			if (
				'' !== $donor_name &&
				preg_match( '/\bid\s*=\s*(["\'])brxe-vvqtfa\1/i', $image_tag ) &&
				! preg_match( '/\balt\s*=\s*(["\'])[^"\']+\1/i', $image_tag )
			) {
				$alt_text = sprintf( '%s, darczyńca Campusu Bemke', $donor_name );
			}

			if ( '' === $alt_text ) {
				if ( ! preg_match( '/\ssrc\s*=\s*(["\'])([^"\']+)\1/i', $image_tag, $source_match ) ) {
					return $image_tag;
				}

				$filename = bemke_child_get_canonical_image_filename( $source_match[2] );

				if ( ! isset( $alternatives[ $filename ] ) ) {
					return $image_tag;
				}

				$alt_text = $alternatives[ $filename ];
			}

			$alt_attribute = 'alt="' . esc_attr( $alt_text ) . '"';

			if ( preg_match( '/\salt\s*=\s*(["\'])[^"\']*\1/i', $image_tag ) ) {
				$updated_tag = preg_replace(
					'/\salt\s*=\s*(["\'])[^"\']*\1/i',
					' ' . $alt_attribute,
					$image_tag,
					1
				);

				return null === $updated_tag ? $image_tag : $updated_tag;
			}

			$updated_tag = preg_replace( '/\s*\/?>$/', ' ' . $alt_attribute . '>', $image_tag, 1 );

			return null === $updated_tag ? $image_tag : $updated_tag;
		},
		$html
	);

	return null === $updated_html ? $html : $updated_html;
}

/**
 * Normalize WordPress responsive-size filenames to their original upload name.
 *
 * @param string $source Image URL from an img element.
 * @return string
 */
function bemke_child_get_canonical_image_filename( $source ) {
	$path = wp_parse_url( html_entity_decode( $source, ENT_QUOTES, 'UTF-8' ), PHP_URL_PATH );

	if ( ! is_string( $path ) || '' === $path ) {
		return '';
	}

	$filename            = rawurldecode( wp_basename( $path ) );
	$canonical_filename  = preg_replace( '/-\d+x\d+(?=\.[^.]+$)/i', '', $filename );

	return null === $canonical_filename ? $filename : $canonical_filename;
}

/**
 * Image alternatives verified against the public staging site on 5 August 2026.
 *
 * Decorative colour textures (CTA backgrounds and section backgrounds) are
 * deliberately absent from this list and therefore retain alt="".
 *
 * @return array<string, string>
 */
function bemke_child_get_image_alternatives() {
	return array(
		// Images previously using the generic value "Opis zdjęcia".
		'AnimowaneCampus2.webp'                         => 'Wizualizacja planowanego Budynku Centralnego na Campusie Bemke',
		'AnimowaneEdukacjaCollege.webp'                => 'Uczniowie Bemke College rozmawiający podczas spaceru po kampusie',
		'AnimowaneEdukacjaPrzedszkole.webp'            => 'Dzieci bawiące się na świeżym powietrzu w Przedszkolu Bemke',
		'AnimowaneEdukacjaPrzedszkoleM-J.webp'          => 'Dzieci podczas zajęć plastycznych w Przedszkolu Bemke',
		'AnimowaneEdukacjaSzkolaPodstawowa.webp'       => 'Uczennice z zebranymi rzodkiewkami podczas zajęć w ogrodzie',
		'AnimowaneExploreLeadecamp.webp'               => 'Młodzież pracująca w grupach podczas warsztatów',
		'AnimowaneExplorePolkolonie.webp'              => 'Uczestniczki półkolonii podczas zajęć na świeżym powietrzu',
		'AnimowaneExploreTutoring.webp'                => 'Uczestnicy programu Bemke Explore w auli',
		'AnimowaneFalconsKoszykowka.webp'              => 'Zawodnicy podczas meczu koszykówki',
		'AnimowaneRozwojExplore.webp'                  => 'Młodzież podczas wspólnej aktywności na Campusie Bemke',
		'AnimowaneRozwojFalcons.webp'                  => 'Trener prowadzący trening taekwondo dla dzieci',
		'AnimowaneRozwojSteam.webp'                    => 'Uczniowie konstruujący drewniane mechanizmy podczas warsztatów STEAM',
		'AnimowaneUslugiCollegium.webp'                => 'Wizualizacja odnowionego Collegium Marianum i otaczającego go ogrodu',
		'AnimowaneUslugiFirmy.webp'                    => 'Bufet z przekąskami przygotowany na wydarzenie firmowe',
		'AnimowaneUslugiHala.webp'                     => 'Dzieci podczas treningu taekwondo w hali sportowej',
		'AnimowaneUslugiImprezy.webp'                  => 'Desery i wypieki przygotowane w ramach cateringu Bemke',
		'AnimowaneUslugiNoclegi.webp'                  => 'Przygotowane łóżko w pokoju noclegowym',
		'AnimowaneUslugiWioska.webp'                   => 'Wioska Edukacyjna Campus Bemke otoczona zielenią',
		'AnimowaneWarsztatyCyklicznePinball.webp'      => 'Uczestnicy konstruujący mechaniczną grę podczas warsztatów',
		'AnimowaneWarsztatyCykliczneSensoryka.webp'    => 'Uczestniczki wybierające materiały do budowy ścieżki sensorycznej',
		'AnimowaneWarsztatyCykliczneSzycie.webp'       => 'Przybory do szycia i projektowania ubrań',
		'AnimowaneWarsztatyCykliczneWarsztat.webp'     => 'Narzędzia i materiały do pracy nad makietą miasta',
		'raisingstars.webp'                             => 'Chłopiec wykonujący technikę podczas treningu taekwondo',
		'22.07CampusCollegium-2.webp'                  => 'Młodzież przed budynkiem Collegium Marianum',
		'22.07CampusInne-2.webp'                       => 'Uczniowie pracujący w ogrodzie FarmLab',
		'22.07CampusPrzedszkole-2.webp'                => 'Budynek Przedszkola Bemke na terenie kampusu',
		'23.07explorezimowisko.webp'                   => 'Dzieci bawiące się na śniegu podczas zimowiska',
		'historiadzis.webp'                            => 'Wioska Edukacyjna Campus Bemke otoczona zielenią',
		'instytut.webp'                                => 'Prowadząca podczas szkolenia dla nauczycieli',
		'kampaniafaza1.webp'                           => 'Zabudowania Wioski Edukacyjnej na Campusie Bemke',
		'nauczyciele.webp'                             => 'Uczestnicy szkolenia dla nauczycieli z otrzymanymi dyplomami',
		'nowepraca.webp'                               => 'Prowadząca eksperyment podczas zajęć z dziećmi',

		// Klub Sportowy Bemke and taekwondo.
		'669884602_17874081528590836_196652035836319748_n.webp' => 'Drużyna koszykarska Klubu Sportowego Bemke wraz z kibicami',
		'670015487_17874166446590836_201119490585457460_n.webp' => 'Koszykarz Klubu Sportowego Bemke po meczu',
		'670427704_1266258081724141_7525645878990105553_n.webp' => 'Mecz koszykówki Klubu Sportowego Bemke',
		'670566012_2073723400237599_428121321002526520_n.webp' => 'Kibice dopingujący drużynę Klubu Sportowego Bemke',
		'670572217_978908764821665_7939144766066790169_n.webp' => 'Zawodnicy podczas sparingu taekwondo',
		'670906058_17874847833590836_147947746522227371_n.webp' => 'Dzieci ćwiczące kopnięcia podczas treningu taekwondo',
		'726231338_17886278301590836_6545446551525098733_n.webp' => 'Uczestnicy treningu taekwondo z dyplomami',
		'736349266_1068741058817375_6061577178798875752_n.webp' => 'Grafika z tekstem: Dziękujemy Wam za ten rok z KS Bemke!',
		'741402765_17890541100590836_3686788760103826506_n.webp' => 'Taekwondo – podsumowanie pierwszego roku Klubu Sportowego',
		'742130640_17890189341590836_6952206934610918084_n.webp' => '70 meczów – ogromna dawka boiskowej walki i rywalizacji o każdy punkt',
		'elite.webp'                                   => 'Pokaz technik taekwondo dla dzieci i rodziców',
		'foto.webp'                                    => 'Trener sprawdzający kopnięcie dziecka podczas egzaminu taekwondo',
		'trener.webp'                                  => 'Trener taekwondo z uczestniczkami i dyplomem ukończenia egzaminu',
		'KaruzelaTaekwondo1.webp'                      => 'Dziewczynka wykonująca kopnięcie w tarczę podczas treningu taekwondo',
		'KaruzelaTaekwondo2.webp'                      => 'Chłopiec prezentujący kopnięcie podczas egzaminu taekwondo',
		'KaruzelaTaekwondo3.webp'                      => 'Trener zawiązujący dziecku żółty pas taekwondo',
		'KaruzelaTaekwondo4.webp'                      => 'Pokaz rozbijania desek podczas egzaminu taekwondo',
		'KaruzelaTaekwondo5.webp'                      => 'Uśmiechnięta uczestniczka otrzymująca żółty pas taekwondo',
		'KaruzelaTaekwondo6.webp'                      => 'Trener prowadzący zajęcia taekwondo dla dzieci',
		'KaruzelaTaekwondo7.webp'                      => 'Dzieci ćwiczące w parach podczas treningu taekwondo',
		'KaruzelaTaekwondo8.webp'                      => 'Uczestniczka przybijająca piątkę z trenerem taekwondo',

		// Bemke history, team and community.
		'zalozyciele-2.webp'                           => 'Karolina i Tomasz Domogała, założyciele Bemke',
		'1909.webp'                                    => 'Archiwalne zdjęcie budynku Collegium Marianum',
		'2013.webp'                                    => 'Dzieci rysujące kredą podczas zajęć na świeżym powietrzu',
		'2022.webp'                                    => 'Uczestnicy Kampanii Założycielskiej Bemke podczas spotkania w auli',
		'2foto.webp'                                   => 'Archiwalne zajęcia uczniów na świeżym powietrzu',
		'karuzela1.webp'                               => 'Archiwalne zdjęcie uczniów przy kamiennym moście',
		'lata20.webp'                                  => 'Archiwalne zdjęcie budynku Collegium Marianum',
		'teraz.webp'                                   => 'Uczennice rozmawiające przy stole przed Collegium Marianum',
		'22.07historia.webp'                           => 'Archiwalne zdjęcie wychowanków i księdza w parku',
		'22.07historia-scaled.webp'                    => 'Archiwalne zdjęcie wychowanków i księdza w parku',
		'22.07historia2.webp'                          => 'Archiwalne zdjęcie grupy wychowanków z akordeonem',
		'Historia1947.webp'                            => 'Archiwalne zdjęcie uczniów podczas gry w tenisa stołowego',
		'NOWA.webp'                                    => 'Archiwalne zdjęcie wychowanków i opiekunów Collegium Marianum',
		'2025-1.webp'                                  => 'Uczniowie wykonujący doświadczenie w szkolnym laboratorium',
		'2025EdukacjaPozaformalna.webp'                => 'Dziecko wykonujące kopnięcie podczas treningu taekwondo',
		'2025Partnerstwo.webp'                         => 'Uczestnicy Kampanii Założycielskiej Bemke podczas spotkania w auli',
		'2025ThinkTank.webp'                           => 'Uczestnicy spotkania eksperckiego przy wspólnym stole',
		'2025WsparcieRodzin.webp'                      => 'Nauczycielka i dzieci podczas zajęć w szkolnym ogrodzie',
		'2025WzorowePlacowki.webp'                     => 'Nauczycielka pracująca z uczniami w szkolnej bibliotece',
		'bemke2050SzkolenieNauczycieli.webp'           => 'Uczestniczki szkolenia dla nauczycieli',
		// The person's name and role are already provided immediately beside these portraits.
		// Empty alternatives prevent screen readers from announcing the same information twice.
		'nowyportretdaria.webp'                        => '',
		'nowyportretkasia.webp'                        => '',
		'nowyportretprzemek.webp'                      => '',
		'urszula.webp'                                 => '',
		'urszula-1.webp'                               => '',
		'kasiabaran.webp'                              => 'Katarzyna Ostrowska, Fundraising Manager',
		'portret1.webp'                                => 'Olek, uczestnik programu Bemke Explore',
		'portret3.webp'                                => 'Ania, uczestniczka programu Bemke Explore',
		'portet2.webp'                                 => 'Anita, uczestniczka programu Bemke Explore',

		// Education, campus and workshops.
		'FotoFullScreen-scaled.webp'                  => 'Uczniowie odpoczywający na dziedzińcu Wioski Edukacyjnej',
		'grafika1.webp'                               => 'Dziecięce dłonie trzymające drewnianą rakietę',
		'grafika2.webp'                               => 'Dłonie trzymające makietę budynku Wioski Edukacyjnej',
		'karta1.webp'                                 => 'Uczestnicy szkolenia w pracowni Wioski Edukacyjnej',
		'karta2.webp'                                 => 'Dzieci budujące drewniany domek podczas warsztatów',
		'karta3-1.webp'                               => 'Dzieci konstruujące robota podczas zajęć STEAM',
		'karta3.webp'                                 => 'Wioska Edukacyjna Campus Bemke otoczona ogrodem',
		'karuzela1-1.webp'                            => 'Uczennice rozmawiające przy stole przed Collegium Marianum',
		'karuzela2.webp'                              => 'Uczestnicy wydarzenia w auli Wioski Edukacyjnej',
		'KaruzelaMainPage1.webp'                      => 'Uczniowie przechodzący obok ogrodu FarmLab',
		'KaruzelaMainPage2.webp'                      => 'Nauczycielka i dzieci obserwujący doświadczenie',
		'KaruzelaMainPage3.webp'                      => 'Uczennice rozmawiające przy stole przed Collegium Marianum',
		'KaruzelaMainPage4.webp'                      => 'Wnętrze auli Wioski Edukacyjnej',
		'KaruzelaMainPage5.webp'                      => 'Trener prowadzący zajęcia taekwondo dla dzieci',
		'KaruzelaMainPage6.webp'                      => 'Detal elewacji Wioski Edukacyjnej z logo Bemke',
		'KaruzelaMainPage7.webp'                      => 'Uczennice stojące razem w parku Campusu Bemke',
		'KaruzelaMainPage8.webp'                      => 'Uczennice prezentujące wykonaną wspólnie makietę domu',
		'21.07cykliczne.webp'                         => 'Prowadzący pomaga uczniom budować konstrukcję z materiałów z recyklingu',
		'21.07dlanauczycieli.webp'                    => 'Nauczycielka i dzieci podczas zajęć w szkolnym ogrodzie',
		'21.07dlaszkol.webp'                          => 'Uczennice prezentujące wykonaną wspólnie makietę domu',
		'21.07eksperymenty.webp'                      => 'Dzieci wykonujące doświadczenie z cieczami',
		'21.07farmlab.webp'                           => 'Uczniowie pracujący w ogrodzie FarmLab',
		'21.07majsterkowanie.webp'                    => 'Uczniowie majsterkujący w pracowni MakerSpace',
		'21.07sztukaikreatywnosc.webp'                => 'Uczeń tworzący rzeźbę z gliny',
		'22.07edukacja.webp'                          => 'Młodzież podczas zajęć w szkolnej bibliotece',
		'22.07karuzela1-2.webp'                       => 'Uczeń szyjący na maszynie podczas warsztatów',
		'22.07karuzela2-2.webp'                       => 'Uczniowie pracujący z masą plastyczną podczas warsztatów',
		'22.07karuzela3-2.webp'                       => 'Dziecko układające mozaikę z nasion',
		'22.07karuzela4-2.webp'                       => 'Dzieci wspólnie malujące podczas warsztatów',
		'22.07karuzela5-2.webp'                       => 'Uczeń wycinający element z drewna na wyrzynarce',
		'22.07karuzela6-2.webp'                       => 'Prowadząca demonstrująca doświadczenie podczas zajęć z dziećmi',
		'22.07karuzela7-2.webp'                       => 'Dzieci malujące pod opieką prowadzącej',
		'cykliczne1.webp'                             => 'Prowadzący pomaga uczniowi łączyć elementy konstrukcji',
		'cykliczne2.webp'                             => 'Uczeń tworzący rzeźbę z gliny',
		'cykliczne3.webp'                             => 'Dzieci budujące hotel dla owadów',
		'cykliczne4.webp'                             => 'Dzieci wykonujące doświadczenie z cieczami',
		'cykliczne5.webp'                             => 'Uczeń modelujący głowę z gliny',
		'cykliczne6.webp'                             => 'Dzieci obserwujące doświadczenie w pracowni',
		'designthinking-2.webp'                      => 'Dłonie trzymające przybory do kreatywnego projektowania',
		'steam-2.webp'                               => 'Dłonie trzymające linijki i lornetkę',

		// Workshops for teachers.
		'KaruzelaSTEAM1.webp'                         => 'Uczestnicy szkolenia w pracowni Wioski Edukacyjnej',
		'KaruzelaSTEAM2.webp'                         => 'Nauczyciele pracujący nad prototypem z kartonu',
		'KaruzelaSTEAM3.webp'                         => 'Prowadząca prezentująca drewniany model podczas szkolenia',
		'KaruzelaSTEAM4.webp'                         => 'Uczestniczki szkolenia omawiające przygotowany szkic',
		'KaruzelaSTEAM5.webp'                         => 'Uczestnicy budujący ruchomy model dłoni z kartonu',
		'KaruzelaSTEAM6.webp'                         => 'Nauczyciele pracujący w grupach podczas szkolenia STEAM',

		// Campus services, rooms and catering.
		'catering0.webp'                              => 'Bufet grillowy z warzywami i opisem menu',
		'catering1.webp'                              => 'Mini burgery przygotowane w ramach cateringu Bemke',
		'catering2.webp'                              => 'Półmisek z kanapkami i przekąskami cateringowymi',
		'catering3.webp'                              => 'Kwiaty stanowiące dekorację stołu',
		'catering4.webp'                              => 'Golonka z kapustą podana w ramach cateringu Bemke',
		'miejsca0.webp'                               => 'Schody widowni w auli Wioski Edukacyjnej',
		'miejsca1.webp'                               => 'Sala lekcyjna w Wiosce Edukacyjnej',
		'miejsca3.webp'                               => 'Ogród FarmLab z widokiem na góry',
		'miejsca4.webp'                               => 'Pracownia laboratoryjna w Wiosce Edukacyjnej',
		'miejsca5.webp'                               => 'Aula Wioski Edukacyjnej z widokiem na dziedziniec',
		'miejsca6.webp'                               => 'Sala szkoleniowa z ekranem multimedialnym',
		'miejsca7.webp'                               => 'Ceglane schody i taras Wioski Edukacyjnej',

		// Maps, donors, press materials and partner logos.
		'Darczyncy.webp'                              => 'Tablica darczyńcy Grupa Maspex przy Budynku Głównym Campusu Bemke',
		'nowadarczyncyfoto-scaled.webp'               => 'Uczniowie odpoczywający na dziedzińcu Wioski Edukacyjnej',
		'nowedarczyncy-scaled.webp'                   => 'Darczyńcy Kampanii Założycielskiej Bemke podczas spotkania w auli',
		'LLObszar-roboczy-9-kopia-2@2x.webp'          => 'Dofinansowane przez Unię Europejską',
		'LLObszar-roboczy-9-kopia-3@2x.webp'          => 'Małopolska',
		'LLObszar-roboczy-9-kopia@2x.webp'            => 'Rzeczpospolita Polska',
		'LLObszar-roboczy-9@2x.webp'                  => 'Fundusze Europejskie dla Małopolski',
		'logo-horizontal-on-light.svg'                => 'Pracodawcy RP',
		'logo1@2x.webp'                               => 'Komitet do spraw Pożytku Publicznego',
		'logo2@2x.webp'                               => 'Narodowy Instytut Wolności',
		'logo3@2x.webp'                               => 'Fundusz Młodzieżowy',
		'mapka-mobile-bemke-scaled.webp'              => 'Plan Campusu Bemke z zaznaczonymi najważniejszymi obiektami',
		'maps-bemke-info-scaled.webp'                 => 'Plan Campusu Bemke z zaznaczonymi najważniejszymi obiektami',
		'nowelogopack.webp'                           => 'Logo Bemke',
		'nowepaczkazdjec.webp'                        => 'Dzieci majsterkujące w pracowni MakerSpace',
		'nowabemkefundacja2.webp'                     => 'Przejdź do strony Fundacji Bemke',
		'nowafundacjacampusbemke.webp'                => 'Przejdź do strony Fundacji Campus Bemke',
		'praca-m-2.png'                               => 'Wnętrze auli Wioski Edukacyjnej podczas wydarzenia',
	);
}
