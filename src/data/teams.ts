import type { Player, Position, Team } from '../types'

// ═════════════════════════════════════════════════════════════════════════════
//  WC26 TEAM & SQUAD DATA — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
//  This file is intentionally easy to edit. To change a squad, edit the compact
//  player tuples below. Each tuple is:  [name, shirtNumber, position, rating]
//    - position: 'GK' | 'DEF' | 'MID' | 'FWD'
//    - rating:   1–99 overall (drives the match sim + the 1–5 star display)
//
//  To add/replace a whole team, copy a `team(...)` block and fill it in.
//
//  GROUPS: this is the REAL, official 2026 FIFA World Cup final draw (held
//  5 Dec 2025), with the 48 qualified nations placed in their actual groups
//  A–L in seeded order. (Notably: Italy did not qualify.) Squads are real
//  current internationals (~15 per team) and are freely editable.
// ═════════════════════════════════════════════════════════════════════════════

export interface SquadTeam extends Team {
  players: Player[]
}

// Compact player tuple: [name, number, position, rating]
type P = [string, number, Position, number]

function team(
  id: string,
  name: string,
  flag: string,
  colors: [string, string],
  group: string,
  ranking: number,
  players: P[],
): SquadTeam {
  return {
    id,
    name,
    flag,
    colors,
    group,
    ranking,
    players: players.map(([pname, number, position, rating], i) => ({
      id: `${id}-${i}`,
      name: pname,
      number,
      position,
      rating,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP A — Mexico, South Africa, South Korea, Czech Republic
// ─────────────────────────────────────────────────────────────────────────────
const A: SquadTeam[] = [
  team('mex', 'Mexico', '🇲🇽', ['#0a6b3b', '#ffffff'], 'A', 14, [
    ['Guillermo Ochoa', 13, 'GK', 78], ['Luis Malagón', 1, 'GK', 75],
    ['Jorge Sánchez', 19, 'DEF', 75], ['César Montes', 3, 'DEF', 77],
    ['Johan Vásquez', 4, 'DEF', 78], ['Jesús Gallardo', 23, 'DEF', 76],
    ['Edson Álvarez', 4, 'MID', 81], ['Luis Romo', 6, 'MID', 77],
    ['Orbelín Pineda', 10, 'MID', 76], ['Uriel Antuna', 22, 'MID', 75],
    ['Hirving Lozano', 22, 'FWD', 80], ['Santiago Giménez', 9, 'FWD', 80],
    ['Raúl Jiménez', 9, 'FWD', 78], ['Alexis Vega', 11, 'FWD', 76],
    ['Roberto Alvarado', 8, 'MID', 75],
  ]),
  team('zaf', 'South Africa', '🇿🇦', ['#007749', '#ffb81c'], 'A', 36, [
    ['Ronwen Williams', 1, 'GK', 78], ['Ricardo Goss', 16, 'GK', 71],
    ['Nkosinathi Sibisi', 5, 'DEF', 73], ['Mothobi Mvala', 6, 'DEF', 73],
    ['Aubrey Modiba', 3, 'DEF', 74], ['Khuliso Mudau', 2, 'DEF', 73],
    ['Siyanda Xulu', 4, 'DEF', 72], ['Teboho Mokoena', 8, 'MID', 76],
    ['Sphephelo Sithole', 15, 'MID', 73], ['Themba Zwane', 10, 'MID', 75],
    ['Oswin Appollis', 7, 'MID', 73], ['Bongokuhle Hlongwane', 22, 'MID', 73],
    ['Percy Tau', 11, 'FWD', 75], ['Lyle Foster', 9, 'FWD', 76],
    ['Evidence Makgopa', 19, 'FWD', 73],
  ]),
  team('kor', 'South Korea', '🇰🇷', ['#ffffff', '#cd2e3a'], 'A', 23, [
    ['Kim Seung-gyu', 21, 'GK', 76], ['Jo Hyeon-woo', 1, 'GK', 76],
    ['Kim Min-jae', 4, 'DEF', 84], ['Kim Young-gwon', 19, 'DEF', 75],
    ['Kim Moon-hwan', 2, 'DEF', 74], ['Lee Ki-je', 14, 'DEF', 73],
    ['Hwang In-beom', 6, 'MID', 79], ['Lee Jae-sung', 17, 'MID', 78],
    ['Park Yong-woo', 5, 'MID', 74], ['Lee Kang-in', 18, 'MID', 81],
    ['Son Heung-min', 7, 'FWD', 85], ['Hwang Hee-chan', 11, 'FWD', 80],
    ['Cho Gue-sung', 9, 'FWD', 76], ['Oh Hyeon-gyu', 22, 'FWD', 74],
    ['Hwang Ui-jo', 16, 'FWD', 74],
  ]),
  team('cze', 'Czech Republic', '🇨🇿', ['#d7141a', '#11457e'], 'A', 32, [
    ['Jindřich Staněk', 1, 'GK', 78], ['Matěj Kovář', 23, 'GK', 75],
    ['Ladislav Krejčí', 2, 'DEF', 78], ['Vladimír Coufal', 5, 'DEF', 77],
    ['Tomáš Holeš', 6, 'DEF', 75], ['Robin Hranáč', 3, 'DEF', 74],
    ['David Zima', 4, 'DEF', 73], ['Tomáš Souček', 8, 'MID', 81],
    ['Lukáš Provod', 20, 'MID', 76], ['Antonín Barák', 15, 'MID', 77],
    ['Pavel Šulc', 10, 'MID', 75], ['Michal Sadílek', 18, 'MID', 73],
    ['Patrik Schick', 9, 'FWD', 82], ['Adam Hložek', 22, 'FWD', 77],
    ['Václav Černý', 11, 'FWD', 76],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP B — Canada, Bosnia and Herzegovina, Qatar, Switzerland
// ─────────────────────────────────────────────────────────────────────────────
const B: SquadTeam[] = [
  team('can', 'Canada', '🇨🇦', ['#ff0000', '#ffffff'], 'B', 16, [
    ['Maxime Crépeau', 16, 'GK', 75], ['Dayne St. Clair', 1, 'GK', 74],
    ['Alphonso Davies', 19, 'DEF', 84], ['Moïse Bombito', 4, 'DEF', 76],
    ['Derek Cornelius', 13, 'DEF', 74], ['Alistair Johnston', 2, 'DEF', 77],
    ['Stephen Eustáquio', 7, 'MID', 78], ['Ismaël Koné', 6, 'MID', 76],
    ['Jonathan Osorio', 21, 'MID', 75], ['Tajon Buchanan', 11, 'MID', 78],
    ['Jonathan David', 20, 'FWD', 83], ['Cyle Larin', 17, 'FWD', 77],
    ['Liam Millar', 18, 'FWD', 73], ['Jacob Shaffelburg', 14, 'FWD', 74],
    ['Promise David', 9, 'FWD', 74],
  ]),
  team('bih', 'Bosnia and Herzegovina', '🇧🇦', ['#002395', '#ffec00'], 'B', 40, [
    ['Nikola Vasilj', 1, 'GK', 75], ['Ibrahim Šehić', 12, 'GK', 71],
    ['Sead Kolašinac', 13, 'DEF', 78], ['Amar Dedić', 2, 'DEF', 77],
    ['Nikola Katić', 5, 'DEF', 74], ['Dennis Hadžikadunić', 4, 'DEF', 72],
    ['Adnan Kovačević', 3, 'DEF', 71], ['Miralem Pjanić', 8, 'MID', 79],
    ['Ivan Šunjić', 6, 'MID', 73], ['Benjamin Tahirović', 20, 'MID', 73],
    ['Edin Višća', 14, 'MID', 75], ['Armin Gigović', 16, 'MID', 71],
    ['Edin Džeko', 11, 'FWD', 80], ['Ermedin Demirović', 9, 'FWD', 78],
    ['Smail Prevljak', 17, 'FWD', 73],
  ]),
  team('qat', 'Qatar', '🇶🇦', ['#8a1538', '#ffffff'], 'B', 44, [
    ['Meshaal Barsham', 22, 'GK', 72], ['Saad Al-Sheeb', 1, 'GK', 71],
    ['Boualem Khoukhi', 16, 'DEF', 72], ['Tarek Salman', 15, 'DEF', 72],
    ['Bassam Al-Rawi', 3, 'DEF', 72], ['Pedro Miguel', 13, 'DEF', 72],
    ['Karim Boudiaf', 14, 'MID', 72], ['Hassan Al-Haydos', 10, 'MID', 74],
    ['Abdulaziz Hatem', 23, 'MID', 72], ['Akram Afif', 11, 'MID', 78],
    ['Ismaeel Mohammad', 18, 'MID', 71], ['Almoez Ali', 19, 'FWD', 76],
    ['Mohammed Muntari', 9, 'FWD', 72], ['Ahmed Alaaeldin', 17, 'FWD', 71],
    ['Yusuf Abdurisag', 7, 'FWD', 71],
  ]),
  team('sui', 'Switzerland', '🇨🇭', ['#ff0000', '#ffffff'], 'B', 19, [
    ['Yann Sommer', 1, 'GK', 83], ['Gregor Kobel', 12, 'GK', 82],
    ['Manuel Akanji', 5, 'DEF', 83], ['Nico Elvedi', 4, 'DEF', 78],
    ['Ricardo Rodríguez', 13, 'DEF', 77], ['Silvan Widmer', 2, 'DEF', 75],
    ['Granit Xhaka', 10, 'MID', 84], ['Remo Freuler', 8, 'MID', 78],
    ['Denis Zakaria', 6, 'MID', 79], ['Xherdan Shaqiri', 23, 'MID', 78],
    ['Ruben Vargas', 17, 'MID', 76], ['Breel Embolo', 7, 'FWD', 79],
    ['Zeki Amdouni', 9, 'FWD', 76], ['Dan Ndoye', 20, 'FWD', 76],
    ['Steven Zuber', 15, 'MID', 74],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP C — Brazil, Morocco, Haiti, Scotland
// ─────────────────────────────────────────────────────────────────────────────
const C: SquadTeam[] = [
  team('bra', 'Brazil', '🇧🇷', ['#ffdf00', '#009b3a'], 'C', 5, [
    ['Alisson', 1, 'GK', 87], ['Ederson', 23, 'GK', 85],
    ['Marquinhos', 4, 'DEF', 85], ['Gabriel Magalhães', 3, 'DEF', 84],
    ['Éder Militão', 2, 'DEF', 83], ['Danilo', 6, 'DEF', 80],
    ['Bruno Guimarães', 5, 'MID', 85], ['Lucas Paquetá', 7, 'MID', 82],
    ['Casemiro', 15, 'MID', 82], ['Rodrygo', 10, 'FWD', 85],
    ['Vinícius Júnior', 20, 'FWD', 89], ['Raphinha', 19, 'FWD', 84],
    ['Endrick', 9, 'FWD', 80], ['Gabriel Martinelli', 18, 'FWD', 81],
    ['Savinho', 11, 'FWD', 80],
  ]),
  team('mar', 'Morocco', '🇲🇦', ['#c1272d', '#006233'], 'C', 12, [
    ['Yassine Bounou', 1, 'GK', 83], ['Munir Mohamedi', 12, 'GK', 74],
    ['Achraf Hakimi', 2, 'DEF', 85], ['Noussair Mazraoui', 3, 'DEF', 81],
    ['Nayef Aguerd', 5, 'DEF', 80], ['Romain Saïss', 6, 'DEF', 77],
    ['Sofyan Amrabat', 4, 'MID', 80], ['Azzedine Ounahi', 8, 'MID', 79],
    ['Bilal El Khannouss', 7, 'MID', 78], ['Brahim Díaz', 19, 'MID', 82],
    ['Hakim Ziyech', 14, 'FWD', 80], ['Youssef En-Nesyri', 9, 'FWD', 80],
    ['Sofiane Boufal', 17, 'FWD', 78], ['Eliesse Ben Seghir', 21, 'FWD', 78],
    ['Ayoub El Kaabi', 20, 'FWD', 78],
  ]),
  team('hai', 'Haiti', '🇭🇹', ['#00209f', '#d21034'], 'C', 46, [
    ['Johny Placide', 16, 'GK', 70], ['Josué Duverger', 1, 'GK', 68],
    ['Ricardo Adé', 4, 'DEF', 71], ['Carlens Arcus', 2, 'DEF', 71],
    ['Andrew Jean-Baptiste', 5, 'DEF', 70], ['Garvens Metelus', 3, 'DEF', 70],
    ['Danley Jean Jacques', 8, 'MID', 73], ['Jean Ricner Bellegarde', 20, 'MID', 76],
    ['Carl Sainté', 6, 'MID', 70], ['Leverton Pierre', 14, 'MID', 69],
    ['Frantzdy Pierrot', 9, 'FWD', 73], ['Duckens Nazon', 11, 'FWD', 71],
    ['Don Deedson Louicius', 7, 'FWD', 70], ['Ruben Providence', 19, 'FWD', 71],
    ['Jean-Kévin Augustin', 10, 'FWD', 71],
  ]),
  team('sco', 'Scotland', '🏴', ['#0065bf', '#ffffff'], 'C', 34, [
    ['Angus Gunn', 1, 'GK', 75], ['Craig Gordon', 12, 'GK', 73],
    ['Andrew Robertson', 3, 'DEF', 82], ['Kieran Tierney', 6, 'DEF', 79],
    ['Jack Hendry', 4, 'DEF', 75], ['Scott McKenna', 5, 'DEF', 74],
    ['Scott McTominay', 8, 'MID', 81], ['Billy Gilmour', 15, 'MID', 77],
    ['John McGinn', 7, 'MID', 80], ['Ryan Christie', 11, 'MID', 75],
    ['Stuart Armstrong', 17, 'MID', 74], ['Che Adams', 9, 'FWD', 76],
    ['Lyndon Dykes', 18, 'FWD', 74], ['Ben Doak', 22, 'FWD', 74],
    ['Lawrence Shankland', 20, 'FWD', 74],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP D — USA, Paraguay, Australia, Turkey
// ─────────────────────────────────────────────────────────────────────────────
const D: SquadTeam[] = [
  team('usa', 'United States', '🇺🇸', ['#002868', '#bf0a30'], 'D', 15, [
    ['Matt Turner', 1, 'GK', 78], ['Patrick Schulte', 12, 'GK', 73],
    ['Sergiño Dest', 2, 'DEF', 79], ['Chris Richards', 3, 'DEF', 78],
    ['Antonee Robinson', 5, 'DEF', 80], ['Tim Ream', 13, 'DEF', 75],
    ['Tyler Adams', 4, 'MID', 79], ['Weston McKennie', 8, 'MID', 81],
    ['Yunus Musah', 6, 'MID', 78], ['Malik Tillman', 11, 'MID', 78],
    ['Christian Pulisic', 10, 'FWD', 84], ['Folarin Balogun', 9, 'FWD', 79],
    ['Tim Weah', 21, 'FWD', 77], ['Ricardo Pepi', 16, 'FWD', 77],
    ['Gio Reyna', 7, 'MID', 78],
  ]),
  team('par', 'Paraguay', '🇵🇾', ['#d52b1e', '#0038a8'], 'D', 31, [
    ['Roberto Fernández', 1, 'GK', 73], ['Carlos Coronel', 23, 'GK', 73],
    ['Gustavo Gómez', 2, 'DEF', 78], ['Fabián Balbuena', 5, 'DEF', 74],
    ['Omar Alderete', 3, 'DEF', 76], ['Junior Alonso', 6, 'DEF', 74],
    ['Andrés Cubas', 13, 'MID', 75], ['Mathías Villasanti', 8, 'MID', 74],
    ['Damián Bobadilla', 16, 'MID', 73], ['Diego Gómez', 11, 'MID', 76],
    ['Miguel Almirón', 10, 'FWD', 78], ['Julio Enciso', 9, 'FWD', 78],
    ['Antonio Sanabria', 19, 'FWD', 75], ['Ramón Sosa', 7, 'FWD', 75],
    ['Adam Bareiro', 21, 'FWD', 73],
  ]),
  team('aus', 'Australia', '🇦🇺', ['#ffcd00', '#00843d'], 'D', 24, [
    ['Mathew Ryan', 1, 'GK', 78], ['Joe Gauci', 18, 'GK', 72],
    ['Harry Souttar', 19, 'DEF', 77], ['Kye Rowles', 4, 'DEF', 74],
    ['Cameron Burgess', 5, 'DEF', 73], ['Aziz Behich', 16, 'DEF', 74],
    ['Aaron Mooy', 13, 'MID', 76], ['Jackson Irvine', 22, 'MID', 76],
    ['Connor Metcalfe', 8, 'MID', 73], ['Riley McGree', 17, 'MID', 74],
    ['Craig Goodwin', 11, 'MID', 75], ['Mathew Leckie', 7, 'FWD', 75],
    ['Mitchell Duke', 15, 'FWD', 73], ['Kusini Yengi', 9, 'FWD', 73],
    ['Martin Boyle', 10, 'FWD', 74],
  ]),
  team('tur', 'Turkey', '🇹🇷', ['#e30a17', '#ffffff'], 'D', 27, [
    ['Altay Bayındır', 23, 'GK', 76], ['Uğurcan Çakır', 1, 'GK', 79],
    ['Merih Demiral', 3, 'DEF', 78], ['Abdülkerim Bardakcı', 4, 'DEF', 76],
    ['Ferdi Kadıoğlu', 14, 'DEF', 78], ['Mert Müldür', 2, 'DEF', 76],
    ['Hakan Çalhanoğlu', 10, 'MID', 85], ['Orkun Kökçü', 18, 'MID', 79],
    ['İsmail Yüksek', 22, 'MID', 75], ['Arda Güler', 8, 'MID', 82],
    ['Yusuf Yazıcı', 17, 'MID', 76], ['Kenan Yıldız', 21, 'FWD', 81],
    ['Kerem Aktürkoğlu', 7, 'FWD', 79], ['Barış Alper Yılmaz', 9, 'FWD', 77],
    ['Cenk Tosun', 11, 'FWD', 74],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP E — Germany, Curaçao, Ivory Coast, Ecuador
// ─────────────────────────────────────────────────────────────────────────────
const E: SquadTeam[] = [
  team('ger', 'Germany', '🇩🇪', ['#000000', '#dd0000'], 'E', 8, [
    ['Marc-André ter Stegen', 1, 'GK', 86], ['Oliver Baumann', 12, 'GK', 76],
    ['Antonio Rüdiger', 2, 'DEF', 85], ['Jonathan Tah', 4, 'DEF', 82],
    ['Joshua Kimmich', 6, 'DEF', 86], ['Maximilian Mittelstädt', 18, 'DEF', 78],
    ['Toni Kroos', 8, 'MID', 86], ['İlkay Gündoğan', 21, 'MID', 84],
    ['Robert Andrich', 23, 'MID', 78], ['Florian Wirtz', 17, 'MID', 87],
    ['Jamal Musiala', 10, 'MID', 87], ['Kai Havertz', 7, 'FWD', 84],
    ['Niclas Füllkrug', 9, 'FWD', 80], ['Leroy Sané', 19, 'FWD', 83],
    ['Serge Gnabry', 20, 'FWD', 82],
  ]),
  team('cuw', 'Curaçao', '🇨🇼', ['#002b7f', '#f9d90f'], 'E', 47, [
    ['Eloy Room', 1, 'GK', 72], ['Cies Breuning', 16, 'GK', 67],
    ['Cuco Martina', 2, 'DEF', 71], ['Juriën Gaari', 5, 'DEF', 71],
    ['Roshon van Eijma', 3, 'DEF', 70], ['Shaquille Pinas', 4, 'DEF', 71],
    ['Livano Comenencia', 6, 'DEF', 71], ['Leandro Bacuna', 8, 'MID', 73],
    ['Jurich Carolina', 7, 'MID', 71], ['Kenji Gorré', 17, 'MID', 71],
    ['Tahith Chong', 11, 'MID', 74], ['Sontje Hansen', 14, 'MID', 72],
    ['Gervane Kastaneer', 9, 'FWD', 71], ['Rangelo Janga', 19, 'FWD', 71],
    ['Jeremy Antonisse', 20, 'FWD', 70],
  ]),
  team('civ', 'Ivory Coast', '🇨🇮', ['#ff8200', '#009639'], 'E', 21, [
    ['Yahia Fofana', 16, 'GK', 73], ['Badra Ali Sangaré', 1, 'GK', 71],
    ['Odilon Kossounou', 4, 'DEF', 77], ['Willy Boly', 22, 'DEF', 75],
    ['Ghislain Konan', 3, 'DEF', 73], ['Serge Aurier', 2, 'DEF', 74],
    ['Franck Kessié', 8, 'MID', 80], ['Seko Fofana', 5, 'MID', 78],
    ['Ibrahim Sangaré', 17, 'MID', 78], ['Jean Michaël Seri', 6, 'MID', 74],
    ['Simon Adingra', 11, 'FWD', 78], ['Sébastien Haller', 9, 'FWD', 78],
    ['Nicolas Pépé', 18, 'FWD', 77], ['Jonathan Bamba', 20, 'FWD', 75],
    ['Amad Diallo', 21, 'FWD', 79],
  ]),
  team('ecu', 'Ecuador', '🇪🇨', ['#ffd100', '#0033a0'], 'E', 22, [
    ['Hernán Galíndez', 1, 'GK', 74], ['Alexander Domínguez', 22, 'GK', 72],
    ['Piero Hincapié', 3, 'DEF', 81], ['Willian Pacho', 5, 'DEF', 81],
    ['Félix Torres', 2, 'DEF', 76], ['Pervis Estupiñán', 7, 'DEF', 80],
    ['Moisés Caicedo', 23, 'MID', 84], ['Alan Franco', 13, 'MID', 75],
    ['Carlos Gruezo', 20, 'MID', 74], ['Jhegson Méndez', 6, 'MID', 74],
    ['Kendry Páez', 19, 'MID', 76], ['Enner Valencia', 14, 'FWD', 77],
    ['Gonzalo Plata', 10, 'FWD', 77], ['Kevin Rodríguez', 9, 'FWD', 74],
    ['Jeremy Sarmiento', 11, 'FWD', 74],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP F — Netherlands, Japan, Sweden, Tunisia
// ─────────────────────────────────────────────────────────────────────────────
const F: SquadTeam[] = [
  team('ned', 'Netherlands', '🇳🇱', ['#ff6200', '#ffffff'], 'F', 7, [
    ['Bart Verbruggen', 1, 'GK', 81], ['Mark Flekken', 12, 'GK', 78],
    ['Virgil van Dijk', 4, 'DEF', 87], ['Matthijs de Ligt', 3, 'DEF', 84],
    ['Nathan Aké', 5, 'DEF', 82], ['Denzel Dumfries', 22, 'DEF', 81],
    ['Frenkie de Jong', 21, 'MID', 86], ['Tijjani Reijnders', 14, 'MID', 82],
    ['Ryan Gravenberch', 8, 'MID', 82], ['Xavi Simons', 7, 'MID', 83],
    ['Cody Gakpo', 11, 'FWD', 84], ['Memphis Depay', 10, 'FWD', 82],
    ['Donyell Malen', 18, 'FWD', 79], ['Wout Weghorst', 19, 'FWD', 77],
    ['Brian Brobbey', 9, 'FWD', 78],
  ]),
  team('jpn', 'Japan', '🇯🇵', ['#1d2a72', '#ffffff'], 'F', 17, [
    ['Zion Suzuki', 1, 'GK', 78], ['Daniel Schmidt', 12, 'GK', 75],
    ['Ko Itakura', 3, 'DEF', 79], ['Takehiro Tomiyasu', 16, 'DEF', 80],
    ['Hiroki Ito', 22, 'DEF', 78], ['Yukinari Sugawara', 19, 'DEF', 76],
    ['Wataru Endo', 6, 'MID', 80], ['Hidemasa Morita', 13, 'MID', 78],
    ['Daichi Kamada', 15, 'MID', 80], ['Takefusa Kubo', 8, 'MID', 81],
    ['Kaoru Mitoma', 9, 'FWD', 82], ['Takumi Minamino', 10, 'FWD', 79],
    ['Junya Ito', 14, 'FWD', 79], ['Ayase Ueda', 20, 'FWD', 77],
    ['Ritsu Doan', 11, 'FWD', 79],
  ]),
  team('swe', 'Sweden', '🇸🇪', ['#006aa7', '#fecc00'], 'F', 26, [
    ['Robin Olsen', 1, 'GK', 76], ['Kristoffer Nordfeldt', 12, 'GK', 73],
    ['Victor Lindelöf', 3, 'DEF', 79], ['Isak Hien', 4, 'DEF', 78],
    ['Gabriel Gudmundsson', 5, 'DEF', 75], ['Emil Krafth', 2, 'DEF', 73],
    ['Lukas Bergvall', 8, 'MID', 76], ['Hjalmar Ekdal', 6, 'MID', 73],
    ['Yasin Ayari', 15, 'MID', 74], ['Emil Forsberg', 10, 'MID', 78],
    ['Jesper Karlström', 14, 'MID', 73], ['Alexander Isak', 9, 'FWD', 86],
    ['Viktor Gyökeres', 11, 'FWD', 85], ['Dejan Kulusevski', 7, 'FWD', 83],
    ['Anthony Elanga', 17, 'FWD', 80],
  ]),
  team('tun', 'Tunisia', '🇹🇳', ['#e70013', '#ffffff'], 'F', 35, [
    ['Aymen Dahmen', 16, 'GK', 73], ['Béchir Ben Saïd', 1, 'GK', 72],
    ['Montassar Talbi', 3, 'DEF', 75], ['Yassine Meriah', 2, 'DEF', 73],
    ['Ali Abdi', 12, 'DEF', 73], ['Wajdi Kechrida', 21, 'DEF', 72],
    ['Aïssa Laïdouni', 14, 'MID', 77], ['Ellyes Skhiri', 8, 'MID', 78],
    ['Ferjani Sassi', 6, 'MID', 73], ['Hannibal Mejbri', 13, 'MID', 75],
    ['Elias Achouri', 11, 'MID', 74], ['Naïm Sliti', 10, 'FWD', 75],
    ['Youssef Msakni', 7, 'FWD', 74], ['Wahbi Khazri', 9, 'FWD', 74],
    ['Seifeddine Jaziri', 19, 'FWD', 73],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP G — Belgium, Egypt, Iran, New Zealand
// ─────────────────────────────────────────────────────────────────────────────
const G: SquadTeam[] = [
  team('bel', 'Belgium', '🇧🇪', ['#e30613', '#ffd700'], 'G', 10, [
    ['Thibaut Courtois', 1, 'GK', 88], ['Koen Casteels', 12, 'GK', 79],
    ['Wout Faes', 4, 'DEF', 78], ['Zeno Debast', 3, 'DEF', 77],
    ['Timothy Castagne', 21, 'DEF', 79], ['Arthur Theate', 5, 'DEF', 77],
    ['Kevin De Bruyne', 7, 'MID', 88], ['Youri Tielemans', 8, 'MID', 82],
    ['Amadou Onana', 20, 'MID', 81], ['Charles De Ketelaere', 6, 'MID', 80],
    ['Jérémy Doku', 22, 'FWD', 82], ['Romelu Lukaku', 9, 'FWD', 84],
    ['Leandro Trossard', 17, 'FWD', 81], ['Dodi Lukebakio', 11, 'FWD', 78],
    ['Johan Bakayoko', 19, 'FWD', 78],
  ]),
  team('egy', 'Egypt', '🇪🇬', ['#ce1126', '#ffffff'], 'G', 25, [
    ['Mohamed El Shenawy', 1, 'GK', 75], ['Mohamed Abou Gabal', 23, 'GK', 72],
    ['Ahmed Hegazy', 6, 'DEF', 75], ['Mohamed Abdelmonem', 20, 'DEF', 74],
    ['Ahmed Fattouh', 13, 'DEF', 73], ['Omar Kamal', 2, 'DEF', 72],
    ['Mohamed Elneny', 17, 'MID', 76], ['Tarek Hamed', 8, 'MID', 74],
    ['Emam Ashour', 7, 'MID', 76], ['Mahmoud Trezeguet', 21, 'MID', 77],
    ['Ahmed Sayed Zizo', 14, 'MID', 75], ['Mohamed Salah', 10, 'FWD', 88],
    ['Omar Marmoush', 9, 'FWD', 81], ['Mostafa Mohamed', 19, 'FWD', 76],
    ['Mohamed Sherif', 18, 'FWD', 73],
  ]),
  team('irn', 'Iran', '🇮🇷', ['#ffffff', '#239f40'], 'G', 28, [
    ['Alireza Beiranvand', 1, 'GK', 76], ['Payam Niazmand', 22, 'GK', 73],
    ['Sadegh Moharrami', 2, 'DEF', 73], ['Shojae Khalilzadeh', 4, 'DEF', 73],
    ['Majid Hosseini', 5, 'DEF', 73], ['Milad Mohammadi', 3, 'DEF', 73],
    ['Ramin Rezaeian', 13, 'DEF', 74], ['Saeid Ezatolahi', 6, 'MID', 75],
    ['Ahmad Nourollahi', 8, 'MID', 75], ['Alireza Jahanbakhsh', 7, 'MID', 77],
    ['Saman Ghoddos', 21, 'MID', 75], ['Mehdi Ghayedi', 16, 'MID', 73],
    ['Mehdi Taremi', 9, 'FWD', 82], ['Sardar Azmoun', 20, 'FWD', 80],
    ['Karim Ansarifard', 10, 'FWD', 73],
  ]),
  team('nzl', 'New Zealand', '🇳🇿', ['#ffffff', '#000000'], 'G', 37, [
    ['Alex Paulsen', 1, 'GK', 71], ['Max Crocombe', 12, 'GK', 70],
    ['Tommy Smith', 4, 'DEF', 72], ['Michael Boxall', 5, 'DEF', 72],
    ['Nando Pijnaker', 19, 'DEF', 71], ['Liberato Cacace', 3, 'DEF', 74],
    ['Joe Bell', 6, 'MID', 72], ['Marko Stamenic', 17, 'MID', 72],
    ['Matthew Garbett', 8, 'MID', 72], ['Sarpreet Singh', 20, 'MID', 72],
    ['Clément Bates', 14, 'MID', 70], ['Chris Wood', 9, 'FWD', 79],
    ['Ben Waine', 11, 'FWD', 72], ['Elijah Just', 7, 'FWD', 71],
    ['Kosta Barbarouses', 10, 'FWD', 71],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP H — Spain, Cape Verde, Saudi Arabia, Uruguay
// ─────────────────────────────────────────────────────────────────────────────
const H: SquadTeam[] = [
  team('esp', 'Spain', '🇪🇸', ['#c60b1e', '#ffc400'], 'H', 3, [
    ['Unai Simón', 23, 'GK', 84], ['David Raya', 1, 'GK', 83],
    ['Robin Le Normand', 3, 'DEF', 82], ['Aymeric Laporte', 14, 'DEF', 82],
    ['Dani Carvajal', 2, 'DEF', 84], ['Marc Cucurella', 24, 'DEF', 81],
    ['Rodri', 16, 'MID', 90], ['Pedri', 9, 'MID', 86],
    ['Fabián Ruiz', 8, 'MID', 83], ['Dani Olmo', 10, 'MID', 84],
    ['Lamine Yamal', 19, 'FWD', 86], ['Nico Williams', 17, 'FWD', 84],
    ['Álvaro Morata', 7, 'FWD', 82], ['Mikel Oyarzabal', 21, 'FWD', 82],
    ['Ferran Torres', 11, 'FWD', 81],
  ]),
  team('cpv', 'Cape Verde', '🇨🇻', ['#003893', '#ffffff'], 'H', 43, [
    ['Vozinha', 1, 'GK', 72], ['Márcio Rosa', 12, 'GK', 68],
    ['Stopira', 3, 'DEF', 72], ['Roberto Lopes', 5, 'DEF', 73],
    ['Diney', 2, 'DEF', 71], ['Kenny Rocha Santos', 6, 'DEF', 71],
    ['Steven Moreira', 4, 'DEF', 73], ['Deroy Duarte', 8, 'MID', 73],
    ['Laros Duarte', 15, 'MID', 72], ['Jamiro Monteiro', 10, 'MID', 74],
    ['Kevin Pina', 7, 'MID', 72], ['Pico', 16, 'MID', 71],
    ['Garry Rodrigues', 11, 'FWD', 74], ['Ryan Mendes', 9, 'FWD', 73],
    ['Willy Semedo', 17, 'FWD', 72],
  ]),
  team('ksa', 'Saudi Arabia', '🇸🇦', ['#006c35', '#ffffff'], 'H', 39, [
    ['Mohammed Al-Owais', 21, 'GK', 73], ['Nawaf Al-Aqidi', 1, 'GK', 70],
    ['Ali Al-Bulayhi', 5, 'DEF', 73], ['Hassan Tambakti', 3, 'DEF', 72],
    ['Saud Abdulhamid', 2, 'DEF', 73], ['Sultan Al-Ghannam', 13, 'DEF', 72],
    ['Mohamed Kanno', 28, 'MID', 73], ['Nasser Al-Dawsari', 16, 'MID', 73],
    ['Salem Al-Dawsari', 10, 'MID', 78], ['Abdulrahman Ghareeb', 11, 'MID', 73],
    ['Musab Al-Juwayr', 7, 'MID', 72], ['Firas Al-Buraikan', 9, 'FWD', 75],
    ['Saleh Al-Shehri', 20, 'FWD', 73], ['Abdullah Radif', 18, 'FWD', 72],
    ['Sami Al-Najei', 23, 'MID', 72],
  ]),
  team('uru', 'Uruguay', '🇺🇾', ['#5cb7eb', '#ffffff'], 'H', 11, [
    ['Sergio Rochet', 23, 'GK', 77], ['Santiago Mele', 1, 'GK', 73],
    ['Ronald Araújo', 4, 'DEF', 84], ['José María Giménez', 2, 'DEF', 83],
    ['Mathías Olivera', 17, 'DEF', 79], ['Nahitan Nández', 16, 'DEF', 77],
    ['Federico Valverde', 15, 'MID', 88], ['Manuel Ugarte', 5, 'MID', 80],
    ['Rodrigo Bentancur', 6, 'MID', 81], ['Nicolás de la Cruz', 10, 'MID', 80],
    ['Facundo Pellistri', 11, 'MID', 77], ['Darwin Núñez', 9, 'FWD', 83],
    ['Federico Viñas', 19, 'FWD', 75], ['Maximiliano Araújo', 7, 'FWD', 76],
    ['Brian Rodríguez', 20, 'FWD', 76],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP I — France, Senegal, Iraq, Norway
// ─────────────────────────────────────────────────────────────────────────────
const I: SquadTeam[] = [
  team('fra', 'France', '🇫🇷', ['#1e3a8a', '#ffffff'], 'I', 2, [
    ['Mike Maignan', 1, 'GK', 86], ['Brice Samba', 16, 'GK', 78],
    ['William Saliba', 17, 'DEF', 85], ['Dayot Upamecano', 4, 'DEF', 83],
    ['Theo Hernández', 22, 'DEF', 84], ['Jules Koundé', 5, 'DEF', 84],
    ['Aurélien Tchouaméni', 8, 'MID', 85], ['Eduardo Camavinga', 6, 'MID', 84],
    ['Adrien Rabiot', 14, 'MID', 82], ['Antoine Griezmann', 7, 'FWD', 86],
    ['Kylian Mbappé', 10, 'FWD', 91], ['Ousmane Dembélé', 11, 'FWD', 84],
    ['Marcus Thuram', 9, 'FWD', 82], ['Randal Kolo Muani', 12, 'FWD', 81],
    ['Bradley Barcola', 20, 'FWD', 80],
  ]),
  team('sen', 'Senegal', '🇸🇳', ['#00853f', '#fdef42'], 'I', 18, [
    ['Édouard Mendy', 16, 'GK', 81], ['Mory Diaw', 1, 'GK', 73],
    ['Kalidou Koulibaly', 3, 'DEF', 82], ['Abdou Diallo', 22, 'DEF', 78],
    ['Ismail Jakobs', 12, 'DEF', 76], ['Youssouf Sabaly', 21, 'DEF', 76],
    ['Idrissa Gueye', 5, 'MID', 79], ['Pape Matar Sarr', 17, 'MID', 79],
    ['Pape Gueye', 6, 'MID', 76], ['Krépin Diatta', 11, 'MID', 77],
    ['Sadio Mané', 10, 'FWD', 84], ['Nicolas Jackson', 9, 'FWD', 80],
    ['Ismaïla Sarr', 18, 'FWD', 79], ['Boulaye Dia', 19, 'FWD', 77],
    ['Habib Diallo', 13, 'FWD', 75],
  ]),
  team('irq', 'Iraq', '🇮🇶', ['#ffffff', '#ce1126'], 'I', 41, [
    ['Jalal Hassan', 1, 'GK', 72], ['Ahmad Basil', 22, 'GK', 69],
    ['Rebin Sulaka', 3, 'DEF', 72], ['Merchas Doski', 2, 'DEF', 72],
    ['Akam Hashim', 5, 'DEF', 71], ['Hussein Ali', 4, 'DEF', 71],
    ['Zaid Tahseen', 6, 'DEF', 70], ['Amir Al-Ammari', 8, 'MID', 74],
    ['Ibrahim Bayesh', 10, 'MID', 73], ['Bashar Resan', 17, 'MID', 72],
    ['Zidane Iqbal', 14, 'MID', 73], ['Osama Rashid', 15, 'MID', 72],
    ['Aymen Hussein', 9, 'FWD', 74], ['Ali Al-Hamadi', 11, 'FWD', 74],
    ['Mohanad Ali', 20, 'FWD', 73],
  ]),
  team('nor', 'Norway', '🇳🇴', ['#ba0c2f', '#00205b'], 'I', 20, [
    ['Ørjan Nyland', 12, 'GK', 74], ['Egil Selvik', 1, 'GK', 71],
    ['Kristoffer Ajer', 4, 'DEF', 77], ['Leo Østigård', 5, 'DEF', 75],
    ['Julian Ryerson', 2, 'DEF', 76], ['David Møller Wolfe', 3, 'DEF', 73],
    ['Martin Ødegaard', 10, 'MID', 87], ['Sander Berge', 6, 'MID', 78],
    ['Patrick Berg', 8, 'MID', 74], ['Fredrik Aursnes', 15, 'MID', 77],
    ['Antonio Nusa', 7, 'FWD', 79], ['Erling Haaland', 9, 'FWD', 91],
    ['Alexander Sørloth', 11, 'FWD', 81], ['Oscar Bobb', 17, 'FWD', 77],
    ['Jørgen Strand Larsen', 19, 'FWD', 77],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP J — Argentina, Algeria, Austria, Jordan
// ─────────────────────────────────────────────────────────────────────────────
const J: SquadTeam[] = [
  team('arg', 'Argentina', '🇦🇷', ['#75aadb', '#ffffff'], 'J', 1, [
    ['Emiliano Martínez', 23, 'GK', 86], ['Gerónimo Rulli', 12, 'GK', 78],
    ['Cuti Romero', 13, 'DEF', 86], ['Lisandro Martínez', 25, 'DEF', 84],
    ['Nicolás Otamendi', 19, 'DEF', 81], ['Nahuel Molina', 26, 'DEF', 80],
    ['Nicolás Tagliafico', 3, 'DEF', 79], ['Rodrigo De Paul', 7, 'MID', 84],
    ['Enzo Fernández', 24, 'MID', 85], ['Alexis Mac Allister', 20, 'MID', 86],
    ['Lionel Messi', 10, 'FWD', 90], ['Julián Álvarez', 9, 'FWD', 87],
    ['Lautaro Martínez', 22, 'FWD', 87], ['Ángel Di María', 11, 'FWD', 82],
    ['Giovani Lo Celso', 21, 'MID', 80],
  ]),
  team('alg', 'Algeria', '🇩🇿', ['#006233', '#ffffff'], 'J', 29, [
    ['Anthony Mandrea', 1, 'GK', 73], ['Alexandre Oukidja', 16, 'GK', 72],
    ['Aïssa Mandi', 4, 'DEF', 76], ['Ramy Bensebaini', 5, 'DEF', 78],
    ['Youcef Atal', 2, 'DEF', 75], ['Mohamed Amine Tougai', 3, 'DEF', 73],
    ['Ismaël Bennacer', 8, 'MID', 80], ['Houssem Aouar', 11, 'MID', 78],
    ['Nabil Bentaleb', 6, 'MID', 74], ['Ramiz Zerrouki', 13, 'MID', 74],
    ['Riyad Mahrez', 7, 'FWD', 83], ['Saïd Benrahma', 10, 'FWD', 78],
    ['Amine Gouiri', 9, 'FWD', 78], ['Baghdad Bounedjah', 17, 'FWD', 75],
    ['Yassine Benzia', 18, 'FWD', 73],
  ]),
  team('aut', 'Austria', '🇦🇹', ['#ed2939', '#ffffff'], 'J', 30, [
    ['Patrick Pentz', 1, 'GK', 76], ['Niklas Hedl', 21, 'GK', 73],
    ['David Alaba', 8, 'DEF', 82], ['Kevin Danso', 4, 'DEF', 78],
    ['Philipp Lienhart', 5, 'DEF', 76], ['Maximilian Wöber', 18, 'DEF', 76],
    ['Konrad Laimer', 6, 'MID', 80], ['Nicolas Seiwald', 13, 'MID', 78],
    ['Christoph Baumgartner', 19, 'MID', 80], ['Marcel Sabitzer', 9, 'MID', 81],
    ['Florian Grillitsch', 7, 'MID', 76], ['Marko Arnautović', 17, 'FWD', 77],
    ['Michael Gregoritsch', 14, 'FWD', 76], ['Patrick Wimmer', 20, 'MID', 75],
    ['Romano Schmid', 22, 'MID', 74],
  ]),
  team('jor', 'Jordan', '🇯🇴', ['#ce1126', '#ffffff'], 'J', 42, [
    ['Yazeed Abulaila', 1, 'GK', 72], ['Abdullah Al-Fakhouri', 22, 'GK', 69],
    ['Yazan Al-Arab', 5, 'DEF', 72], ['Salem Al-Ajalin', 4, 'DEF', 71],
    ['Abdallah Nasib', 3, 'DEF', 71], ['Ihsan Haddad', 2, 'DEF', 71],
    ['Bara Marei', 6, 'DEF', 70], ['Noor Al-Rawabdeh', 8, 'MID', 73],
    ['Nizar Al-Rashdan', 17, 'MID', 73], ['Ehsan Haddad', 15, 'MID', 71],
    ['Rajaei Ayed', 7, 'MID', 71], ['Mahmoud Al-Mardi', 16, 'MID', 71],
    ['Mousa Al-Taamari', 10, 'FWD', 79], ['Yazan Al-Naimat', 9, 'FWD', 74],
    ['Ali Olwan', 11, 'FWD', 73],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP K — Portugal, DR Congo, Uzbekistan, Colombia
// ─────────────────────────────────────────────────────────────────────────────
const K: SquadTeam[] = [
  team('por', 'Portugal', '🇵🇹', ['#006600', '#ff0000'], 'K', 6, [
    ['Diogo Costa', 22, 'GK', 84], ['Rui Patrício', 1, 'GK', 78],
    ['Rúben Dias', 3, 'DEF', 86], ['Pepe', 13, 'DEF', 79],
    ['João Cancelo', 20, 'DEF', 84], ['Nuno Mendes', 19, 'DEF', 83],
    ['Bruno Fernandes', 8, 'MID', 87], ['Vitinha', 16, 'MID', 84],
    ['Rúben Neves', 18, 'MID', 81], ['Bernardo Silva', 10, 'MID', 87],
    ['Cristiano Ronaldo', 7, 'FWD', 84], ['Rafael Leão', 17, 'FWD', 85],
    ['Gonçalo Ramos', 26, 'FWD', 81], ['João Félix', 11, 'FWD', 81],
    ['Pedro Neto', 21, 'FWD', 81],
  ]),
  team('cod', 'DR Congo', '🇨🇩', ['#007fff', '#f7d518'], 'K', 30, [
    ['Lionel Mpasi', 1, 'GK', 74], ['Timothy Fayulu', 16, 'GK', 71],
    ['Chancel Mbemba', 4, 'DEF', 80], ['Arthur Masuaku', 3, 'DEF', 76],
    ['Gédéon Kalulu', 2, 'DEF', 74], ['Axel Tuanzebe', 5, 'DEF', 73],
    ['Rocky Bushiri', 15, 'DEF', 72], ['Charles Pickel', 6, 'MID', 75],
    ['Samuel Moutoussamy', 8, 'MID', 74], ['Edo Kayembe', 17, 'MID', 74],
    ['Théo Bongonda', 11, 'MID', 76], ['Grady Diangana', 20, 'MID', 74],
    ['Yoane Wissa', 9, 'FWD', 80], ['Cédric Bakambu', 13, 'FWD', 76],
    ['Silas', 7, 'FWD', 77],
  ]),
  team('uzb', 'Uzbekistan', '🇺🇿', ['#1eb53a', '#0099b5'], 'K', 38, [
    ['Utkir Yusupov', 1, 'GK', 71], ['Abduvohid Nematov', 12, 'GK', 69],
    ['Abdukodir Khusanov', 4, 'DEF', 77], ['Rustamjon Ashurmatov', 3, 'DEF', 72],
    ['Sherzod Nasrullaev', 2, 'DEF', 71], ['Farrukh Sayfiev', 5, 'DEF', 71],
    ['Jaloliddin Masharipov', 7, 'MID', 74], ['Abbosbek Fayzullaev', 10, 'MID', 76],
    ['Otabek Shukurov', 6, 'MID', 72], ['Azizbek Turgunboev', 11, 'MID', 71],
    ['Khojimat Erkinov', 14, 'MID', 71], ['Eldor Shomurodov', 9, 'FWD', 77],
    ['Igor Sergeev', 17, 'FWD', 72], ['Oston Urunov', 18, 'FWD', 71],
    ['Jasurbek Jaloliddinov', 20, 'MID', 71],
  ]),
  team('col', 'Colombia', '🇨🇴', ['#fcd116', '#003893'], 'K', 13, [
    ['Camilo Vargas', 1, 'GK', 76], ['David Ospina', 12, 'GK', 75],
    ['Dávinson Sánchez', 23, 'DEF', 80], ['Yerry Mina', 13, 'DEF', 77],
    ['Daniel Muñoz', 4, 'DEF', 79], ['Johan Mojica', 17, 'DEF', 76],
    ['Richard Ríos', 15, 'MID', 79], ['Jefferson Lerma', 16, 'MID', 78],
    ['James Rodríguez', 10, 'MID', 81], ['Jhon Arias', 7, 'MID', 79],
    ['Jorge Carrascal', 8, 'MID', 76], ['Luis Díaz', 11, 'FWD', 85],
    ['Jhon Durán', 9, 'FWD', 80], ['Rafael Santos Borré', 19, 'FWD', 76],
    ['Luis Sinisterra', 22, 'FWD', 78],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP L — England, Croatia, Ghana, Panama
// ─────────────────────────────────────────────────────────────────────────────
const L: SquadTeam[] = [
  team('eng', 'England', '🏴', ['#ffffff', '#1e3a8a'], 'L', 4, [
    ['Jordan Pickford', 1, 'GK', 83], ['Dean Henderson', 13, 'GK', 78],
    ['Kyle Walker', 2, 'DEF', 80], ['John Stones', 5, 'DEF', 84],
    ['Marc Guéhi', 6, 'DEF', 80], ['Ezri Konsa', 14, 'DEF', 78],
    ['Trent Alexander-Arnold', 12, 'DEF', 84], ['Declan Rice', 4, 'MID', 86],
    ['Jude Bellingham', 10, 'MID', 88], ['Phil Foden', 11, 'MID', 86],
    ['Cole Palmer', 24, 'MID', 85], ['Harry Kane', 9, 'FWD', 89],
    ['Bukayo Saka', 7, 'FWD', 86], ['Anthony Gordon', 17, 'FWD', 80],
    ['Ollie Watkins', 18, 'FWD', 81],
  ]),
  team('cro', 'Croatia', '🇭🇷', ['#ff0000', '#ffffff'], 'L', 9, [
    ['Dominik Livaković', 1, 'GK', 80], ['Ivica Ivušić', 23, 'GK', 74],
    ['Joško Gvardiol', 20, 'DEF', 85], ['Josip Stanišić', 2, 'DEF', 78],
    ['Borna Sosa', 19, 'DEF', 77], ['Josip Šutalo', 6, 'DEF', 77],
    ['Luka Modrić', 10, 'MID', 84], ['Mateo Kovačić', 8, 'MID', 83],
    ['Marcelo Brozović', 11, 'MID', 82], ['Lovro Majer', 7, 'MID', 79],
    ['Mario Pašalić', 15, 'MID', 78], ['Andrej Kramarić', 9, 'FWD', 79],
    ['Ante Budimir', 17, 'FWD', 76], ['Luka Sučić', 25, 'MID', 76],
    ['Marko Pjaca', 14, 'FWD', 74],
  ]),
  team('gha', 'Ghana', '🇬🇭', ['#ce1126', '#ffd700'], 'L', 33, [
    ['Lawrence Ati-Zigi', 1, 'GK', 73], ['Joseph Wollacott', 12, 'GK', 71],
    ['Alexander Djiku', 5, 'DEF', 75], ['Mohammed Salisu', 18, 'DEF', 77],
    ['Gideon Mensah', 3, 'DEF', 73], ['Tariq Lamptey', 2, 'DEF', 76],
    ['Thomas Partey', 8, 'MID', 82], ['Mohammed Kudus', 20, 'MID', 83],
    ['Elisha Owusu', 4, 'MID', 73], ['Majeed Ashimeru', 21, 'MID', 73],
    ['Jordan Ayew', 10, 'FWD', 77], ['Iñaki Williams', 19, 'FWD', 79],
    ['Antoine Semenyo', 9, 'FWD', 78], ['Kamaldeen Sulemana', 7, 'FWD', 76],
    ['Ernest Nuamah', 14, 'FWD', 75],
  ]),
  team('pan', 'Panama', '🇵🇦', ['#005293', '#db0a16'], 'L', 45, [
    ['Orlando Mosquera', 1, 'GK', 72], ['Luis Mejía', 22, 'GK', 71],
    ['Fidel Escobar', 5, 'DEF', 72], ['Andrés Andrade', 17, 'DEF', 72],
    ['Eric Davis', 15, 'DEF', 72], ['Michael Murillo', 13, 'DEF', 74],
    ['Aníbal Godoy', 20, 'MID', 73], ['Cristian Martínez', 19, 'MID', 72],
    ['Adalberto Carrasquilla', 6, 'MID', 74], ['Édgar Bárcenas', 7, 'MID', 73],
    ['Tomás Rodríguez', 14, 'MID', 71], ['Ismael Díaz', 10, 'FWD', 73],
    ['José Fajardo', 9, 'FWD', 72], ['Cecilio Waterman', 11, 'FWD', 72],
    ['Azarías Londoño', 21, 'FWD', 71],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  Master export — all 48 teams across groups A–L
// ─────────────────────────────────────────────────────────────────────────────
export const TEAMS: SquadTeam[] = [
  ...A, ...B, ...C, ...D, ...E, ...F, ...G, ...H, ...I, ...J, ...K, ...L,
]

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const

export function teamsByGroup(group: string): SquadTeam[] {
  return TEAMS.filter((t) => t.group === group)
}

export function getTeam(id: string): SquadTeam | undefined {
  return TEAMS.find((t) => t.id === id)
}
