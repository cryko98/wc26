import type { Player, Position, Team } from '../types'

// ═════════════════════════════════════════════════════════════════════════════
//  WC26 TEAM & SQUAD DATA — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
//  Edit a squad by editing the compact player tuples below. Each tuple is:
//    [name, shirtNumber, position, rating]
//      position: 'GK' | 'DEF' | 'MID' | 'FWD'
//      rating:   1–99 overall (drives the match sim + the 1–5 star display)
//
//  GROUPS: the REAL, official 2026 FIFA World Cup final draw (5 Dec 2025), all
//  48 qualified nations in their actual groups A–L in seeded order (Italy did
//  not qualify). Each squad has the real World Cup size of 26 players, filled
//  with real internationals. Deep-bench names for smaller nations are
//  best-effort and freely editable.
// ═════════════════════════════════════════════════════════════════════════════

export interface SquadTeam extends Team {
  players: Player[]
}

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
  // Shirt numbers must be unique within a squad. If a tuple repeats a number,
  // the later player is silently moved to the lowest free number (1–99), so
  // hand-edited data can never produce two identical shirts on the pitch.
  const used = new Set<number>()
  const nextFree = () => {
    for (let n = 1; n <= 99; n++) if (!used.has(n)) return n
    return 99
  }
  return {
    id,
    name,
    flag,
    colors,
    group,
    ranking,
    players: players.map(([pname, number, position, rating], i) => {
      const shirt = used.has(number) ? nextFree() : number
      used.add(shirt)
      return {
        id: `${id}-${i}`,
        name: pname,
        number: shirt,
        position,
        rating,
      }
    }),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP A — Mexico, South Africa, South Korea, Czech Republic
// ─────────────────────────────────────────────────────────────────────────────
const A: SquadTeam[] = [
  team('mex', 'Mexico', '🇲🇽', ['#0a6b3b', '#ffffff'], 'A', 14, [
    ['Guillermo Ochoa', 13, 'GK', 78], ['Luis Malagón', 1, 'GK', 75], ['Carlos Acevedo', 12, 'GK', 74],
    ['Jorge Sánchez', 19, 'DEF', 75], ['César Montes', 3, 'DEF', 77], ['Johan Vásquez', 4, 'DEF', 78],
    ['Jesús Gallardo', 23, 'DEF', 76], ['Israel Reyes', 2, 'DEF', 74], ['Kevin Álvarez', 21, 'DEF', 74],
    ['Gerardo Arteaga', 5, 'DEF', 74], ['Jesús Angulo', 6, 'DEF', 73],
    ['Edson Álvarez', 4, 'MID', 81], ['Luis Romo', 18, 'MID', 77], ['Orbelín Pineda', 10, 'MID', 76],
    ['Uriel Antuna', 22, 'MID', 75], ['Roberto Alvarado', 8, 'MID', 75], ['Érick Sánchez', 16, 'MID', 75],
    ['Luis Chávez', 14, 'MID', 76], ['Carlos Rodríguez', 7, 'MID', 74], ['Diego Lainez', 20, 'MID', 74],
    ['Hirving Lozano', 11, 'FWD', 80], ['Santiago Giménez', 9, 'FWD', 80], ['Raúl Jiménez', 17, 'FWD', 78],
    ['Alexis Vega', 15, 'FWD', 76], ['Henry Martín', 24, 'FWD', 76], ['César Huerta', 25, 'FWD', 75],
  ]),
  team('zaf', 'South Africa', '🇿🇦', ['#007749', '#ffb81c'], 'A', 36, [
    ['Ronwen Williams', 1, 'GK', 78], ['Ricardo Goss', 16, 'GK', 71], ['Sipho Chaine', 12, 'GK', 71],
    ['Nkosinathi Sibisi', 5, 'DEF', 73], ['Mothobi Mvala', 6, 'DEF', 73], ['Aubrey Modiba', 3, 'DEF', 74],
    ['Khuliso Mudau', 2, 'DEF', 73], ['Siyanda Xulu', 4, 'DEF', 72], ['Grant Kekana', 15, 'DEF', 72],
    ['Terrence Mashego', 17, 'DEF', 71], ['Nyiko Mobbie', 21, 'DEF', 71],
    ['Teboho Mokoena', 8, 'MID', 76], ['Sphephelo Sithole', 18, 'MID', 73], ['Themba Zwane', 10, 'MID', 75],
    ['Oswin Appollis', 7, 'MID', 73], ['Bongokuhle Hlongwane', 22, 'MID', 73], ['Bathusi Aubaas', 23, 'MID', 72],
    ['Patrick Maswanganyi', 20, 'MID', 73], ['Thalente Mbatha', 14, 'MID', 71],
    ['Percy Tau', 11, 'FWD', 75], ['Lyle Foster', 9, 'FWD', 76], ['Evidence Makgopa', 19, 'FWD', 73],
    ['Iqraam Rayners', 13, 'FWD', 73], ['Mihlali Mayambela', 24, 'FWD', 72], ['Elias Mokwana', 25, 'FWD', 72],
    ['Mduduzi Shabalala', 26, 'MID', 71],
  ]),
  team('kor', 'South Korea', '🇰🇷', ['#ffffff', '#cd2e3a'], 'A', 23, [
    ['Kim Seung-gyu', 21, 'GK', 76], ['Jo Hyeon-woo', 1, 'GK', 76], ['Song Bum-keun', 23, 'GK', 73],
    ['Kim Min-jae', 4, 'DEF', 84], ['Kim Young-gwon', 19, 'DEF', 75], ['Kim Moon-hwan', 2, 'DEF', 74],
    ['Lee Ki-je', 14, 'DEF', 73], ['Kim Ji-soo', 20, 'DEF', 73], ['Cho Yu-min', 5, 'DEF', 73],
    ['Seol Young-woo', 12, 'DEF', 73], ['Kim Tae-hwan', 22, 'DEF', 72],
    ['Hwang In-beom', 6, 'MID', 79], ['Lee Jae-sung', 17, 'MID', 78], ['Lee Kang-in', 18, 'MID', 81],
    ['Park Yong-woo', 15, 'MID', 74], ['Paik Seung-ho', 8, 'MID', 75], ['Won Du-jae', 16, 'MID', 74],
    ['Hong Hyun-seok', 13, 'MID', 74], ['Jung Woo-yeong', 26, 'MID', 73],
    ['Son Heung-min', 7, 'FWD', 85], ['Hwang Hee-chan', 11, 'FWD', 80], ['Cho Gue-sung', 9, 'FWD', 76],
    ['Oh Hyeon-gyu', 24, 'FWD', 74], ['Bae Jun-ho', 10, 'FWD', 75], ['Lee Dong-gyeong', 3, 'MID', 74],
    ['Joo Min-kyu', 25, 'FWD', 73],
  ]),
  team('cze', 'Czech Republic', '🇨🇿', ['#d7141a', '#11457e'], 'A', 32, [
    ['Jindřich Staněk', 1, 'GK', 78], ['Matěj Kovář', 23, 'GK', 75], ['Vítězslav Jaroš', 16, 'GK', 73],
    ['Ladislav Krejčí', 2, 'DEF', 78], ['Vladimír Coufal', 5, 'DEF', 77], ['Tomáš Holeš', 6, 'DEF', 75],
    ['Robin Hranáč', 3, 'DEF', 74], ['David Zima', 4, 'DEF', 73], ['Tomáš Vlček', 22, 'DEF', 72],
    ['Martin Vitík', 15, 'DEF', 73], ['David Jurásek', 18, 'DEF', 74],
    ['Tomáš Souček', 8, 'MID', 81], ['Lukáš Provod', 20, 'MID', 76], ['Antonín Barák', 7, 'MID', 77],
    ['Pavel Šulc', 10, 'MID', 75], ['Michal Sadílek', 14, 'MID', 73], ['Petr Ševčík', 21, 'MID', 73],
    ['Lukáš Červ', 25, 'MID', 73], ['Ondřej Lingr', 17, 'MID', 73],
    ['Patrik Schick', 9, 'FWD', 82], ['Adam Hložek', 13, 'FWD', 77], ['Václav Černý', 11, 'FWD', 76],
    ['Tomáš Chorý', 19, 'FWD', 74], ['Mojmír Chytil', 24, 'FWD', 73], ['Jan Kuchta', 26, 'FWD', 74],
    ['Matěj Vydra', 12, 'FWD', 73],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP B — Canada, Bosnia and Herzegovina, Qatar, Switzerland
// ─────────────────────────────────────────────────────────────────────────────
const B: SquadTeam[] = [
  team('can', 'Canada', '🇨🇦', ['#ff0000', '#ffffff'], 'B', 16, [
    ['Maxime Crépeau', 16, 'GK', 75], ['Dayne St. Clair', 1, 'GK', 74], ['Tom McGill', 12, 'GK', 71],
    ['Alphonso Davies', 19, 'DEF', 84], ['Moïse Bombito', 4, 'DEF', 76], ['Derek Cornelius', 13, 'DEF', 74],
    ['Alistair Johnston', 2, 'DEF', 77], ['Kamal Miller', 5, 'DEF', 73], ['Joel Waterman', 15, 'DEF', 72],
    ['Richie Laryea', 22, 'DEF', 73], ['Sam Adekugbe', 3, 'DEF', 73],
    ['Stephen Eustáquio', 7, 'MID', 78], ['Ismaël Koné', 6, 'MID', 76], ['Jonathan Osorio', 21, 'MID', 75],
    ['Tajon Buchanan', 11, 'MID', 78], ['Mathieu Choinière', 8, 'MID', 72], ['Liam Fraser', 14, 'MID', 71],
    ['Niko Sigur', 17, 'MID', 72],
    ['Jonathan David', 20, 'FWD', 83], ['Cyle Larin', 9, 'FWD', 77], ['Liam Millar', 18, 'FWD', 73],
    ['Jacob Shaffelburg', 24, 'FWD', 74], ['Promise David', 23, 'FWD', 74], ['Ali Ahmed', 25, 'MID', 72],
    ['Tani Oluwaseyi', 26, 'FWD', 74], ['Theo Corbeanu', 10, 'FWD', 72],
  ]),
  team('bih', 'Bosnia and Herzegovina', '🇧🇦', ['#002395', '#ffec00'], 'B', 40, [
    ['Nikola Vasilj', 1, 'GK', 75], ['Ibrahim Šehić', 12, 'GK', 71], ['Vedad Muftić', 23, 'GK', 69],
    ['Sead Kolašinac', 13, 'DEF', 78], ['Amar Dedić', 2, 'DEF', 77], ['Nikola Katić', 5, 'DEF', 74],
    ['Dennis Hadžikadunić', 4, 'DEF', 72], ['Adnan Kovačević', 3, 'DEF', 71], ['Anel Ahmedhodžić', 14, 'DEF', 77],
    ['Sanjin Prcić', 15, 'DEF', 72], ['Eldar Ćivić', 17, 'DEF', 71],
    ['Miralem Pjanić', 8, 'MID', 79], ['Ivan Šunjić', 6, 'MID', 73], ['Benjamin Tahirović', 20, 'MID', 73],
    ['Edin Višća', 18, 'MID', 75], ['Armin Gigović', 16, 'MID', 71], ['Gojko Cimirot', 7, 'MID', 73],
    ['Amar Begić', 21, 'MID', 71], ['Benjamin Kololli', 22, 'MID', 72],
    ['Edin Džeko', 11, 'FWD', 80], ['Ermedin Demirović', 9, 'FWD', 78], ['Smail Prevljak', 17, 'FWD', 73],
    ['Haris Tabaković', 19, 'FWD', 74], ['Nemanja Bilbija', 24, 'FWD', 71], ['Dženan Pejčinović', 25, 'FWD', 71],
    ['Said Hamulić', 26, 'FWD', 72],
  ]),
  team('qat', 'Qatar', '🇶🇦', ['#8a1538', '#ffffff'], 'B', 44, [
    ['Meshaal Barsham', 22, 'GK', 72], ['Saad Al-Sheeb', 1, 'GK', 71], ['Yousef Hassan', 16, 'GK', 70],
    ['Boualem Khoukhi', 15, 'DEF', 72], ['Tarek Salman', 16, 'DEF', 72], ['Bassam Al-Rawi', 3, 'DEF', 72],
    ['Pedro Miguel', 13, 'DEF', 72], ['Ó Boughanmi', 2, 'DEF', 71], ['Jassem Gaber', 14, 'DEF', 71],
    ['Mohammed Waad', 4, 'DEF', 71], ['Sultan Al-Brake', 5, 'DEF', 71],
    ['Karim Boudiaf', 23, 'MID', 72], ['Hassan Al-Haydos', 10, 'MID', 74], ['Abdulaziz Hatem', 12, 'MID', 72],
    ['Akram Afif', 11, 'MID', 78], ['Ismaeel Mohammad', 18, 'MID', 71], ['Mostafa Meshaal', 8, 'MID', 71],
    ['Ahmed Fadel', 17, 'MID', 71], ['Tameem Al-Muhaza', 20, 'MID', 71],
    ['Almoez Ali', 19, 'FWD', 76], ['Mohammed Muntari', 9, 'FWD', 72], ['Ahmed Alaaeldin', 7, 'FWD', 71],
    ['Yusuf Abdurisag', 21, 'FWD', 71], ['Khaled Muneer', 24, 'FWD', 70], ['Hashim Ali', 25, 'FWD', 70],
    ['Ahmed Al-Rawi', 26, 'DEF', 70],
  ]),
  team('sui', 'Switzerland', '🇨🇭', ['#ff0000', '#ffffff'], 'B', 19, [
    ['Yann Sommer', 1, 'GK', 83], ['Gregor Kobel', 12, 'GK', 82], ['Pascal Loretz', 23, 'GK', 71],
    ['Manuel Akanji', 5, 'DEF', 83], ['Nico Elvedi', 4, 'DEF', 78], ['Ricardo Rodríguez', 13, 'DEF', 77],
    ['Silvan Widmer', 2, 'DEF', 75], ['Fabian Schär', 22, 'DEF', 79], ['Cédric Zesiger', 3, 'DEF', 73],
    ['Aurèle Amenda', 15, 'DEF', 73], ['Isaac Schmidt', 21, 'DEF', 72],
    ['Granit Xhaka', 10, 'MID', 84], ['Remo Freuler', 8, 'MID', 78], ['Denis Zakaria', 6, 'MID', 79],
    ['Xherdan Shaqiri', 23, 'MID', 78], ['Ruben Vargas', 17, 'MID', 76], ['Michel Aebischer', 20, 'MID', 75],
    ['Vincent Sierro', 14, 'MID', 73], ['Fabian Rieder', 15, 'MID', 74],
    ['Breel Embolo', 7, 'FWD', 79], ['Zeki Amdouni', 9, 'FWD', 76], ['Dan Ndoye', 11, 'FWD', 76],
    ['Steven Zuber', 18, 'MID', 74], ['Kwadwo Duah', 24, 'FWD', 73], ['Joël Monteiro', 25, 'FWD', 72],
    ['Andi Zeqiri', 26, 'FWD', 73],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP C — Brazil, Morocco, Haiti, Scotland
// ─────────────────────────────────────────────────────────────────────────────
const C: SquadTeam[] = [
  team('bra', 'Brazil', '🇧🇷', ['#ffdf00', '#009b3a'], 'C', 5, [
    ['Alisson', 1, 'GK', 87], ['Ederson', 23, 'GK', 85], ['Bento', 12, 'GK', 78],
    ['Marquinhos', 4, 'DEF', 85], ['Gabriel Magalhães', 3, 'DEF', 84], ['Éder Militão', 2, 'DEF', 83],
    ['Danilo', 6, 'DEF', 80], ['Wendell', 16, 'DEF', 74], ['Beraldo', 14, 'DEF', 76],
    ['Vanderson', 13, 'DEF', 76], ['Caio Henrique', 15, 'DEF', 75],
    ['Bruno Guimarães', 5, 'MID', 85], ['Lucas Paquetá', 7, 'MID', 82], ['Casemiro', 17, 'MID', 82],
    ['André', 8, 'MID', 79], ['Joelinton', 25, 'MID', 80], ['Gerson', 21, 'MID', 78],
    ['Rodrygo', 10, 'FWD', 85], ['Vinícius Júnior', 20, 'FWD', 89], ['Raphinha', 19, 'FWD', 84],
    ['Endrick', 9, 'FWD', 80], ['Gabriel Martinelli', 18, 'FWD', 81], ['Savinho', 11, 'FWD', 80],
    ['Igor Jesus', 24, 'FWD', 76], ['Estêvão', 26, 'FWD', 79], ['João Pedro', 22, 'FWD', 79],
  ]),
  team('mar', 'Morocco', '🇲🇦', ['#c1272d', '#006233'], 'C', 12, [
    ['Yassine Bounou', 1, 'GK', 83], ['Munir Mohamedi', 12, 'GK', 74], ['Mehdi Benabid', 23, 'GK', 71],
    ['Achraf Hakimi', 2, 'DEF', 85], ['Noussair Mazraoui', 3, 'DEF', 81], ['Nayef Aguerd', 5, 'DEF', 80],
    ['Romain Saïss', 6, 'DEF', 77], ['Achraf Dari', 4, 'DEF', 74], ['Jawad El Yamiq', 18, 'DEF', 74],
    ['Yahia Attiyat Allah', 15, 'DEF', 73], ['Adam Masina', 16, 'DEF', 74],
    ['Sofyan Amrabat', 4, 'MID', 80], ['Azzedine Ounahi', 8, 'MID', 79], ['Bilal El Khannouss', 7, 'MID', 78],
    ['Brahim Díaz', 19, 'MID', 82], ['Ismael Saibari', 13, 'MID', 77], ['Amir Richardson', 14, 'MID', 75],
    ['Neil El Aynaoui', 17, 'MID', 75],
    ['Hakim Ziyech', 22, 'FWD', 80], ['Youssef En-Nesyri', 9, 'FWD', 80], ['Sofiane Boufal', 10, 'FWD', 78],
    ['Eliesse Ben Seghir', 21, 'FWD', 78], ['Ayoub El Kaabi', 20, 'FWD', 78], ['Abde Ezzalzouli', 11, 'FWD', 78],
    ['Soufiane Rahimi', 24, 'FWD', 75], ['Amine Adli', 25, 'FWD', 76],
  ]),
  team('hai', 'Haiti', '🇭🇹', ['#00209f', '#d21034'], 'C', 46, [
    ['Johny Placide', 16, 'GK', 70], ['Josué Duverger', 1, 'GK', 68], ['Alexandre Pierre', 23, 'GK', 67],
    ['Ricardo Adé', 4, 'DEF', 71], ['Carlens Arcus', 2, 'DEF', 71], ['Andrew Jean-Baptiste', 5, 'DEF', 70],
    ['Garven Metelus', 3, 'DEF', 70], ['Jean-Kévin Duverne', 6, 'DEF', 71], ['Christopher Attis', 13, 'DEF', 69],
    ['Manno Sanon', 15, 'DEF', 68], ['Leverton Pierre', 14, 'DEF', 69],
    ['Danley Jean Jacques', 8, 'MID', 73], ['Jean Ricner Bellegarde', 20, 'MID', 76], ['Carl Sainté', 17, 'MID', 70],
    ['Stephane Lambese', 21, 'MID', 70], ['Wilde-Donald Guerrier', 18, 'MID', 70], ['Derrick Etienne', 7, 'MID', 73],
    ['Fabrice Picault', 22, 'MID', 71],
    ['Frantzdy Pierrot', 9, 'FWD', 73], ['Duckens Nazon', 11, 'FWD', 71], ['Don Deedson Louicius', 19, 'FWD', 70],
    ['Ruben Providence', 10, 'FWD', 71], ['Jean-Kévin Augustin', 12, 'FWD', 71], ['Dany Jean', 24, 'FWD', 69],
    ['Mondy Prunier', 25, 'FWD', 69], ['Roberto Felix', 26, 'MID', 68],
  ]),
  team('sco', 'Scotland', '🏴', ['#0065bf', '#ffffff'], 'C', 34, [
    ['Angus Gunn', 1, 'GK', 75], ['Craig Gordon', 12, 'GK', 73], ['Cieran Slicker', 23, 'GK', 70],
    ['Andrew Robertson', 3, 'DEF', 82], ['Kieran Tierney', 6, 'DEF', 79], ['Jack Hendry', 4, 'DEF', 75],
    ['Scott McKenna', 5, 'DEF', 74], ['Grant Hanley', 16, 'DEF', 73], ['Anthony Ralston', 2, 'DEF', 73],
    ['Ryan Porteous', 15, 'DEF', 73], ['Max Johnston', 18, 'DEF', 72],
    ['Scott McTominay', 8, 'MID', 81], ['Billy Gilmour', 13, 'MID', 77], ['John McGinn', 7, 'MID', 80],
    ['Ryan Christie', 14, 'MID', 75], ['Stuart Armstrong', 17, 'MID', 74], ['Kenny McLean', 21, 'MID', 73],
    ['Lewis Ferguson', 20, 'MID', 76], ['Connor Barron', 22, 'MID', 72],
    ['Che Adams', 9, 'FWD', 76], ['Lyndon Dykes', 18, 'FWD', 74], ['Ben Doak', 11, 'FWD', 74],
    ['Lawrence Shankland', 10, 'FWD', 74], ['George Hirst', 24, 'FWD', 72], ['Tommy Conway', 25, 'FWD', 72],
    ['James Wilson', 26, 'FWD', 71],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP D — USA, Paraguay, Australia, Turkey
// ─────────────────────────────────────────────────────────────────────────────
const D: SquadTeam[] = [
  team('usa', 'United States', '🇺🇸', ['#002868', '#bf0a30'], 'D', 15, [
    ['Matt Turner', 1, 'GK', 78], ['Patrick Schulte', 12, 'GK', 73], ['Zack Steffen', 23, 'GK', 74],
    ['Sergiño Dest', 2, 'DEF', 79], ['Chris Richards', 3, 'DEF', 78], ['Antonee Robinson', 5, 'DEF', 80],
    ['Tim Ream', 13, 'DEF', 75], ['Joe Scally', 21, 'DEF', 74], ['Cameron Carter-Vickers', 4, 'DEF', 76],
    ['Mark McKenzie', 15, 'DEF', 73], ['Miles Robinson', 16, 'DEF', 74],
    ['Tyler Adams', 4, 'MID', 79], ['Weston McKennie', 8, 'MID', 81], ['Yunus Musah', 6, 'MID', 78],
    ['Malik Tillman', 11, 'MID', 78], ['Gio Reyna', 7, 'MID', 78], ['Johnny Cardoso', 20, 'MID', 76],
    ['Tanner Tessmann', 14, 'MID', 74], ['Luca de la Torre', 25, 'MID', 73],
    ['Christian Pulisic', 10, 'FWD', 84], ['Folarin Balogun', 9, 'FWD', 79], ['Tim Weah', 21, 'FWD', 77],
    ['Ricardo Pepi', 16, 'FWD', 77], ['Haji Wright', 19, 'FWD', 75], ['Josh Sargent', 24, 'FWD', 75],
    ['Brenden Aaronson', 26, 'MID', 76],
  ]),
  team('par', 'Paraguay', '🇵🇾', ['#d52b1e', '#0038a8'], 'D', 31, [
    ['Roberto Fernández', 1, 'GK', 73], ['Carlos Coronel', 23, 'GK', 73], ['Gaspar Servio', 12, 'GK', 71],
    ['Gustavo Gómez', 2, 'DEF', 78], ['Fabián Balbuena', 5, 'DEF', 74], ['Omar Alderete', 3, 'DEF', 76],
    ['Junior Alonso', 6, 'DEF', 74], ['Agustín Sández', 13, 'DEF', 73], ['Juan Cáceres', 15, 'DEF', 72],
    ['Blas Riveros', 16, 'DEF', 72], ['Gustavo Velázquez', 4, 'DEF', 72],
    ['Andrés Cubas', 14, 'MID', 75], ['Mathías Villasanti', 8, 'MID', 74], ['Diego Gómez', 11, 'MID', 76],
    ['Richard Sánchez', 17, 'MID', 73], ['Damián Bobadilla', 18, 'MID', 73], ['Ramón Sosa', 7, 'MID', 75],
    ['Matías Galarza', 20, 'MID', 72],
    ['Miguel Almirón', 10, 'FWD', 78], ['Julio Enciso', 9, 'FWD', 78], ['Antonio Sanabria', 19, 'FWD', 75],
    ['Adam Bareiro', 21, 'FWD', 73], ['Alejandro Romero Gamarra', 22, 'MID', 73], ['Ángel Romero', 24, 'FWD', 73],
    ['Isidro Pitta', 25, 'FWD', 72], ['Gabriel Ávalos', 26, 'FWD', 72],
  ]),
  team('aus', 'Australia', '🇦🇺', ['#ffcd00', '#00843d'], 'D', 24, [
    ['Mathew Ryan', 1, 'GK', 78], ['Joe Gauci', 18, 'GK', 72], ['Paul Izzo', 23, 'GK', 71],
    ['Harry Souttar', 19, 'DEF', 77], ['Kye Rowles', 4, 'DEF', 74], ['Cameron Burgess', 5, 'DEF', 73],
    ['Aziz Behich', 16, 'DEF', 74], ['Lewis Miller', 2, 'DEF', 72], ['Jordan Bos', 3, 'DEF', 74],
    ['Alessandro Circati', 15, 'DEF', 74], ['Gianni Stensness', 6, 'DEF', 72],
    ['Patrick Yazbek', 13, 'MID', 73], ['Jackson Irvine', 22, 'MID', 76], ['Connor Metcalfe', 8, 'MID', 73],
    ['Riley McGree', 17, 'MID', 74], ['Keanu Baccus', 14, 'MID', 72], ['Aiden O’Neill', 20, 'MID', 73],
    ['Ajdin Hrustic', 10, 'MID', 73],
    ['Mathew Leckie', 7, 'FWD', 75], ['Mitchell Duke', 15, 'FWD', 73], ['Kusini Yengi', 9, 'FWD', 73],
    ['Martin Boyle', 11, 'FWD', 74], ['Craig Goodwin', 21, 'FWD', 75], ['Nestory Irankunda', 24, 'FWD', 73],
    ['Adam Taggart', 25, 'FWD', 72], ['Brandon Borrello', 26, 'FWD', 72],
  ]),
  team('tur', 'Turkey', '🇹🇷', ['#e30a17', '#ffffff'], 'D', 27, [
    ['Altay Bayındır', 23, 'GK', 76], ['Uğurcan Çakır', 1, 'GK', 79], ['Mert Günok', 12, 'GK', 76],
    ['Merih Demiral', 3, 'DEF', 78], ['Abdülkerim Bardakcı', 4, 'DEF', 76], ['Ferdi Kadıoğlu', 14, 'DEF', 78],
    ['Mert Müldür', 2, 'DEF', 76], ['Samet Akaydın', 5, 'DEF', 73], ['Caglar Söyüncü', 20, 'DEF', 76],
    ['Eren Elmalı', 15, 'DEF', 73], ['Kaan Ayhan', 18, 'DEF', 74],
    ['Hakan Çalhanoğlu', 10, 'MID', 85], ['Orkun Kökçü', 17, 'MID', 79], ['İsmail Yüksek', 22, 'MID', 75],
    ['Arda Güler', 8, 'MID', 82], ['Yusuf Yazıcı', 16, 'MID', 76], ['Salih Özcan', 6, 'MID', 75],
    ['Atakan Karazor', 21, 'MID', 73],
    ['Kenan Yıldız', 19, 'FWD', 81], ['Kerem Aktürkoğlu', 7, 'FWD', 79], ['Barış Alper Yılmaz', 9, 'FWD', 77],
    ['Cenk Tosun', 11, 'FWD', 74], ['İrfan Can Kahveci', 13, 'MID', 75], ['Semih Kılıçsoy', 24, 'FWD', 73],
    ['Yunus Akgün', 25, 'FWD', 75], ['Deniz Gül', 26, 'FWD', 72],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP E — Germany, Curaçao, Ivory Coast, Ecuador
// ─────────────────────────────────────────────────────────────────────────────
const E: SquadTeam[] = [
  team('ger', 'Germany', '🇩🇪', ['#000000', '#dd0000'], 'E', 8, [
    ['Marc-André ter Stegen', 1, 'GK', 86], ['Oliver Baumann', 12, 'GK', 76], ['Alexander Nübel', 22, 'GK', 79],
    ['Antonio Rüdiger', 2, 'DEF', 85], ['Jonathan Tah', 4, 'DEF', 82], ['Joshua Kimmich', 6, 'DEF', 86],
    ['Maximilian Mittelstädt', 18, 'DEF', 78], ['Nico Schlotterbeck', 15, 'DEF', 81], ['Waldemar Anton', 5, 'DEF', 76],
    ['David Raum', 3, 'DEF', 78], ['Robin Koch', 23, 'DEF', 76],
    ['Robert Andrich', 23, 'MID', 78], ['Florian Wirtz', 17, 'MID', 87], ['Jamal Musiala', 10, 'MID', 87],
    ['Pascal Groß', 13, 'MID', 78], ['Aleksandar Pavlović', 20, 'MID', 79], ['Angelo Stiller', 8, 'MID', 78],
    ['Leon Goretzka', 21, 'MID', 81],
    ['Kai Havertz', 7, 'FWD', 84], ['Niclas Füllkrug', 9, 'FWD', 80], ['Leroy Sané', 19, 'FWD', 83],
    ['Serge Gnabry', 11, 'FWD', 82], ['Nick Woltemade', 14, 'FWD', 78], ['Karim Adeyemi', 24, 'FWD', 79],
    ['Deniz Undav', 25, 'FWD', 78], ['Jamie Gittens', 26, 'FWD', 77],
  ]),
  team('cuw', 'Curaçao', '🇨🇼', ['#002b7f', '#f9d90f'], 'E', 47, [
    ['Eloy Room', 1, 'GK', 72], ['Cies Breuning', 16, 'GK', 67], ['Kenrick Hanenberg', 23, 'GK', 66],
    ['Cuco Martina', 2, 'DEF', 71], ['Juriën Gaari', 5, 'DEF', 71], ['Roshon van Eijma', 3, 'DEF', 70],
    ['Shaquille Pinas', 4, 'DEF', 71], ['Livano Comenencia', 6, 'DEF', 71], ['Armando Obispo', 15, 'DEF', 73],
    ['Jurgen Locadia', 13, 'DEF', 70], ['Demaine Lawrence', 17, 'DEF', 69],
    ['Leandro Bacuna', 8, 'MID', 73], ['Jurich Carolina', 7, 'MID', 71], ['Kenji Gorré', 17, 'MID', 71],
    ['Tahith Chong', 11, 'MID', 74], ['Sontje Hansen', 14, 'MID', 72], ['Juninho Bacuna', 18, 'MID', 73],
    ['Anthony van den Hurk', 20, 'MID', 70],
    ['Gervane Kastaneer', 9, 'FWD', 71], ['Rangelo Janga', 19, 'FWD', 71], ['Jeremy Antonisse', 21, 'FWD', 70],
    ['Bryan Linssen', 10, 'FWD', 72], ['Tyrese Asante', 22, 'FWD', 70], ['Kenneth Dougall', 24, 'MID', 72],
    ['Jearl Margaritha', 25, 'FWD', 70], ['Vurnon Anita', 26, 'MID', 70],
  ]),
  team('civ', 'Ivory Coast', '🇨🇮', ['#ff8200', '#009639'], 'E', 21, [
    ['Yahia Fofana', 16, 'GK', 73], ['Badra Ali Sangaré', 1, 'GK', 71], ['Mohamed Koné', 23, 'GK', 70],
    ['Odilon Kossounou', 4, 'DEF', 77], ['Willy Boly', 22, 'DEF', 75], ['Ghislain Konan', 3, 'DEF', 73],
    ['Serge Aurier', 2, 'DEF', 74], ['Evan Ndicka', 5, 'DEF', 78], ['Wilfried Singo', 17, 'DEF', 79],
    ['Ousmane Diomande', 15, 'DEF', 77], ['Souleymane Diarra', 13, 'DEF', 72],
    ['Franck Kessié', 8, 'MID', 80], ['Seko Fofana', 6, 'MID', 78], ['Ibrahim Sangaré', 20, 'MID', 78],
    ['Jean Michaël Seri', 14, 'MID', 74], ['Lazare Amani', 21, 'MID', 73], ['Hamed Traorè', 18, 'MID', 76],
    ['Ibrahim Cissé', 24, 'MID', 73],
    ['Simon Adingra', 11, 'FWD', 78], ['Sébastien Haller', 9, 'FWD', 78], ['Nicolas Pépé', 19, 'FWD', 77],
    ['Jonathan Bamba', 7, 'FWD', 75], ['Amad Diallo', 10, 'FWD', 79], ['Yan Diomandé', 25, 'FWD', 74],
    ['Jean-Philippe Krasso', 26, 'FWD', 73], ['Oumar Diakité', 12, 'FWD', 73],
  ]),
  team('ecu', 'Ecuador', '🇪🇨', ['#ffd100', '#0033a0'], 'E', 22, [
    ['Hernán Galíndez', 1, 'GK', 74], ['Alexander Domínguez', 22, 'GK', 72], ['Gonzalo Valle', 23, 'GK', 71],
    ['Piero Hincapié', 3, 'DEF', 81], ['Willian Pacho', 5, 'DEF', 81], ['Félix Torres', 2, 'DEF', 76],
    ['Pervis Estupiñán', 7, 'DEF', 80], ['Joel Ordóñez', 4, 'DEF', 76], ['Ángelo Preciado', 17, 'DEF', 76],
    ['Jackson Porozo', 15, 'DEF', 73], ['Xavier Arreaga', 13, 'DEF', 73],
    ['Moisés Caicedo', 23, 'MID', 84], ['Alan Franco', 13, 'MID', 75], ['Jhegson Méndez', 6, 'MID', 74],
    ['Kendry Páez', 19, 'MID', 76], ['Carlos Gruezo', 20, 'MID', 74], ['Patrik Mercado', 14, 'MID', 73],
    ['Jeremy Sarmiento', 11, 'MID', 74],
    ['Enner Valencia', 13, 'FWD', 77], ['Gonzalo Plata', 10, 'FWD', 77], ['Kevin Rodríguez', 9, 'FWD', 74],
    ['John Yeboah', 18, 'FWD', 73], ['Leonardo Campana', 24, 'FWD', 74], ['Nilson Angulo', 25, 'FWD', 74],
    ['Alan Minda', 26, 'FWD', 73], ['Ángel Mena', 12, 'FWD', 73],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP F — Netherlands, Japan, Sweden, Tunisia
// ─────────────────────────────────────────────────────────────────────────────
const F: SquadTeam[] = [
  team('ned', 'Netherlands', '🇳🇱', ['#ff6200', '#ffffff'], 'F', 7, [
    ['Bart Verbruggen', 1, 'GK', 81], ['Mark Flekken', 12, 'GK', 78], ['Nick Olij', 23, 'GK', 73],
    ['Virgil van Dijk', 4, 'DEF', 87], ['Matthijs de Ligt', 3, 'DEF', 84], ['Nathan Aké', 5, 'DEF', 82],
    ['Denzel Dumfries', 22, 'DEF', 81], ['Lutsharel Geertruida', 2, 'DEF', 77], ['Jurriën Timber', 15, 'DEF', 80],
    ['Jan Paul van Hecke', 6, 'DEF', 76], ['Micky van de Ven', 16, 'DEF', 80],
    ['Frenkie de Jong', 21, 'MID', 86], ['Tijjani Reijnders', 14, 'MID', 82], ['Ryan Gravenberch', 8, 'MID', 82],
    ['Xavi Simons', 7, 'MID', 83], ['Jerdy Schouten', 20, 'MID', 78], ['Mats Wieffer', 26, 'MID', 76],
    ['Quinten Timber', 24, 'MID', 76],
    ['Cody Gakpo', 11, 'FWD', 84], ['Memphis Depay', 10, 'FWD', 82], ['Donyell Malen', 18, 'FWD', 79],
    ['Wout Weghorst', 19, 'FWD', 77], ['Brian Brobbey', 9, 'FWD', 78], ['Joshua Zirkzee', 25, 'FWD', 77],
    ['Noa Lang', 17, 'FWD', 77], ['Emanuel Emegha', 13, 'FWD', 75],
  ]),
  team('jpn', 'Japan', '🇯🇵', ['#1d2a72', '#ffffff'], 'F', 17, [
    ['Zion Suzuki', 1, 'GK', 78], ['Daniel Schmidt', 12, 'GK', 75], ['Keisuke Osako', 23, 'GK', 73],
    ['Ko Itakura', 3, 'DEF', 79], ['Takehiro Tomiyasu', 16, 'DEF', 80], ['Hiroki Ito', 22, 'DEF', 78],
    ['Yukinari Sugawara', 19, 'DEF', 76], ['Shogo Taniguchi', 4, 'DEF', 74], ['Kosuke Nakamura', 5, 'DEF', 73],
    ['Yuto Nagatomo', 2, 'DEF', 73], ['Daiki Hashioka', 15, 'DEF', 73],
    ['Wataru Endo', 6, 'MID', 80], ['Hidemasa Morita', 13, 'MID', 78], ['Daichi Kamada', 15, 'MID', 80],
    ['Takefusa Kubo', 8, 'MID', 81], ['Hiroki Sakai', 20, 'MID', 73], ['Reo Hatate', 17, 'MID', 75],
    ['Ao Tanaka', 18, 'MID', 77],
    ['Kaoru Mitoma', 9, 'FWD', 82], ['Takumi Minamino', 10, 'FWD', 79], ['Junya Ito', 14, 'FWD', 79],
    ['Ayase Ueda', 20, 'FWD', 77], ['Ritsu Doan', 11, 'FWD', 79], ['Daizen Maeda', 21, 'FWD', 77],
    ['Koki Ogawa', 24, 'FWD', 74], ['Mao Hosoya', 25, 'FWD', 73],
  ]),
  team('swe', 'Sweden', '🇸🇪', ['#006aa7', '#fecc00'], 'F', 26, [
    ['Robin Olsen', 1, 'GK', 76], ['Kristoffer Nordfeldt', 12, 'GK', 73], ['Viktor Johansson', 23, 'GK', 74],
    ['Victor Lindelöf', 3, 'DEF', 79], ['Isak Hien', 4, 'DEF', 78], ['Gabriel Gudmundsson', 5, 'DEF', 75],
    ['Emil Krafth', 2, 'DEF', 73], ['Hjalmar Ekdal', 6, 'DEF', 73], ['Daniel Svensson', 15, 'DEF', 73],
    ['Samuel Dahl', 16, 'DEF', 73], ['Carl Starfelt', 18, 'DEF', 74],
    ['Lukas Bergvall', 8, 'MID', 76], ['Yasin Ayari', 15, 'MID', 74], ['Emil Forsberg', 10, 'MID', 78],
    ['Jesper Karlström', 14, 'MID', 73], ['Albin Ekdal', 20, 'MID', 73], ['Hugo Larsson', 17, 'MID', 77],
    ['Jens Cajuste', 21, 'MID', 76],
    ['Alexander Isak', 9, 'FWD', 86], ['Viktor Gyökeres', 11, 'FWD', 85], ['Dejan Kulusevski', 7, 'FWD', 83],
    ['Anthony Elanga', 17, 'FWD', 80], ['Jesper Karlsson', 22, 'FWD', 76], ['Viktor Claesson', 24, 'MID', 75],
    ['Roony Bardghji', 25, 'FWD', 75], ['Gustaf Nilsson', 26, 'FWD', 73],
  ]),
  team('tun', 'Tunisia', '🇹🇳', ['#e70013', '#ffffff'], 'F', 35, [
    ['Aymen Dahmen', 16, 'GK', 73], ['Béchir Ben Saïd', 1, 'GK', 72], ['Noureddine Farhati', 23, 'GK', 70],
    ['Montassar Talbi', 3, 'DEF', 75], ['Yassine Meriah', 2, 'DEF', 73], ['Ali Abdi', 12, 'DEF', 73],
    ['Wajdi Kechrida', 21, 'DEF', 72], ['Dylan Bronn', 4, 'DEF', 74], ['Mortadha Ben Ouanes', 15, 'DEF', 72],
    ['Yan Valery', 17, 'DEF', 73], ['Nader Ghandri', 5, 'DEF', 72],
    ['Aïssa Laïdouni', 14, 'MID', 77], ['Ellyes Skhiri', 8, 'MID', 78], ['Ferjani Sassi', 6, 'MID', 73],
    ['Hannibal Mejbri', 13, 'MID', 75], ['Elias Achouri', 11, 'MID', 74], ['Mohamed Ali Ben Romdhane', 7, 'MID', 73],
    ['Anis Ben Slimane', 20, 'MID', 73],
    ['Naïm Sliti', 10, 'FWD', 75], ['Youssef Msakni', 18, 'FWD', 74], ['Wahbi Khazri', 9, 'FWD', 74],
    ['Seifeddine Jaziri', 19, 'FWD', 73], ['Hazem Mastouri', 24, 'FWD', 72], ['Elias Saad', 25, 'FWD', 74],
    ['Firas Chaouat', 26, 'FWD', 72], ['Sayfallah Ltaief', 22, 'FWD', 73],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP G — Belgium, Egypt, Iran, New Zealand
// ─────────────────────────────────────────────────────────────────────────────
const G: SquadTeam[] = [
  team('bel', 'Belgium', '🇧🇪', ['#e30613', '#ffd700'], 'G', 10, [
    ['Thibaut Courtois', 1, 'GK', 88], ['Koen Casteels', 12, 'GK', 79], ['Matz Sels', 23, 'GK', 77],
    ['Wout Faes', 4, 'DEF', 78], ['Zeno Debast', 3, 'DEF', 77], ['Timothy Castagne', 21, 'DEF', 79],
    ['Arthur Theate', 5, 'DEF', 77], ['Maxim De Cuyper', 15, 'DEF', 75], ['Brandon Mechele', 2, 'DEF', 74],
    ['Joaquin Seys', 16, 'DEF', 72], ['Koni De Winter', 18, 'DEF', 76],
    ['Kevin De Bruyne', 7, 'MID', 88], ['Youri Tielemans', 8, 'MID', 82], ['Amadou Onana', 20, 'MID', 81],
    ['Charles De Ketelaere', 6, 'MID', 80], ['Orel Mangala', 14, 'MID', 76], ['Hans Vanaken', 17, 'MID', 76],
    ['Arthur Vermeeren', 24, 'MID', 76],
    ['Jérémy Doku', 22, 'FWD', 82], ['Romelu Lukaku', 9, 'FWD', 84], ['Leandro Trossard', 11, 'FWD', 81],
    ['Dodi Lukebakio', 19, 'FWD', 78], ['Johan Bakayoko', 10, 'FWD', 78], ['Loïs Openda', 25, 'FWD', 81],
    ['Malick Fofana', 13, 'FWD', 78], ['Thomas Meunier', 26, 'DEF', 75],
  ]),
  team('egy', 'Egypt', '🇪🇬', ['#ce1126', '#ffffff'], 'G', 25, [
    ['Mohamed El Shenawy', 1, 'GK', 75], ['Mohamed Abou Gabal', 23, 'GK', 72], ['Mohamed Sobhi', 16, 'GK', 71],
    ['Ahmed Hegazy', 6, 'DEF', 75], ['Mohamed Abdelmonem', 20, 'DEF', 74], ['Ahmed Fattouh', 13, 'DEF', 73],
    ['Omar Kamal', 2, 'DEF', 72], ['Mohamed Hamdy', 4, 'DEF', 72], ['Rami Rabia', 5, 'DEF', 72],
    ['Ahmed Hassan', 15, 'DEF', 72], ['Karim Hafez', 3, 'DEF', 72],
    ['Mohamed Elneny', 17, 'MID', 76], ['Tarek Hamed', 8, 'MID', 74], ['Emam Ashour', 7, 'MID', 76],
    ['Mahmoud Trezeguet', 21, 'MID', 77], ['Ahmed Sayed Zizo', 14, 'MID', 75], ['Nabil Emad', 18, 'MID', 73],
    ['Mohanad Lasheen', 22, 'MID', 72],
    ['Mohamed Salah', 10, 'FWD', 88], ['Omar Marmoush', 9, 'FWD', 81], ['Mostafa Mohamed', 19, 'FWD', 76],
    ['Mohamed Sherif', 11, 'FWD', 73], ['Trezeguet', 24, 'FWD', 75], ['Ibrahim Adel', 25, 'FWD', 74],
    ['Osama Faisal', 26, 'FWD', 72], ['Mahmoud Saber', 12, 'MID', 72],
  ]),
  team('irn', 'Iran', '🇮🇷', ['#ffffff', '#239f40'], 'G', 28, [
    ['Alireza Beiranvand', 1, 'GK', 76], ['Payam Niazmand', 22, 'GK', 73], ['Hossein Hosseini', 12, 'GK', 72],
    ['Sadegh Moharrami', 2, 'DEF', 73], ['Shojae Khalilzadeh', 4, 'DEF', 73], ['Majid Hosseini', 5, 'DEF', 73],
    ['Milad Mohammadi', 3, 'DEF', 73], ['Ramin Rezaeian', 13, 'DEF', 74], ['Aref Aghasi', 15, 'DEF', 72],
    ['Hossein Kanaani', 16, 'DEF', 72], ['Abolfazl Jalali', 18, 'DEF', 73],
    ['Saeid Ezatolahi', 6, 'MID', 75], ['Ahmad Nourollahi', 8, 'MID', 75], ['Alireza Jahanbakhsh', 7, 'MID', 77],
    ['Saman Ghoddos', 21, 'MID', 75], ['Mehdi Ghayedi', 16, 'MID', 73], ['Omid Ebrahimi', 20, 'MID', 72],
    ['Mohammad Mohebi', 17, 'MID', 74],
    ['Mehdi Taremi', 9, 'FWD', 82], ['Sardar Azmoun', 20, 'FWD', 80], ['Karim Ansarifard', 10, 'FWD', 73],
    ['Allahyar Sayyadmanesh', 11, 'FWD', 74], ['Shahriyar Moghanlou', 24, 'FWD', 73], ['Ali Gholizadeh', 25, 'FWD', 74],
    ['Amirhossein Hosseinzadeh', 26, 'FWD', 73], ['Mohammad Karimi', 14, 'MID', 72],
  ]),
  team('nzl', 'New Zealand', '🇳🇿', ['#ffffff', '#000000'], 'G', 37, [
    ['Alex Paulsen', 1, 'GK', 71], ['Max Crocombe', 12, 'GK', 70], ['Oliver Sail', 23, 'GK', 68],
    ['Tommy Smith', 4, 'DEF', 72], ['Michael Boxall', 5, 'DEF', 72], ['Nando Pijnaker', 19, 'DEF', 71],
    ['Liberato Cacace', 3, 'DEF', 74], ['Tyler Bindon', 2, 'DEF', 73], ['Finn Surman', 15, 'DEF', 72],
    ['Francis de Vries', 17, 'DEF', 71], ['Dane Ingham', 13, 'DEF', 70],
    ['Joe Bell', 6, 'MID', 72], ['Marko Stamenic', 18, 'MID', 72], ['Matthew Garbett', 8, 'MID', 72],
    ['Sarpreet Singh', 20, 'MID', 72], ['Clément Bates', 14, 'MID', 70], ['Alex Greive', 21, 'MID', 71],
    ['Matt Sheridan', 22, 'MID', 70],
    ['Chris Wood', 9, 'FWD', 79], ['Ben Waine', 11, 'FWD', 72], ['Elijah Just', 7, 'FWD', 71],
    ['Kosta Barbarouses', 10, 'FWD', 71], ['Eli Just', 24, 'FWD', 70], ['Ben Old', 25, 'FWD', 72],
    ['Kaedyn Kenna', 26, 'FWD', 69], ['Bill Tuiloma', 16, 'DEF', 72],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP H — Spain, Cape Verde, Saudi Arabia, Uruguay
// ─────────────────────────────────────────────────────────────────────────────
const H: SquadTeam[] = [
  team('esp', 'Spain', '🇪🇸', ['#c60b1e', '#ffc400'], 'H', 3, [
    ['Unai Simón', 23, 'GK', 84], ['David Raya', 1, 'GK', 83], ['Álex Remiro', 13, 'GK', 79],
    ['Robin Le Normand', 3, 'DEF', 82], ['Aymeric Laporte', 14, 'DEF', 82], ['Dani Carvajal', 2, 'DEF', 84],
    ['Marc Cucurella', 24, 'DEF', 81], ['Pau Cubarsí', 5, 'DEF', 80], ['Dean Huijsen', 4, 'DEF', 79],
    ['Alejandro Grimaldo', 18, 'DEF', 81], ['Marc Casadó', 15, 'DEF', 77],
    ['Rodri', 16, 'MID', 90], ['Pedri', 9, 'MID', 86], ['Fabián Ruiz', 8, 'MID', 83],
    ['Dani Olmo', 10, 'MID', 84], ['Mikel Merino', 20, 'MID', 82], ['Martín Zubimendi', 17, 'MID', 81],
    ['Pablo Barrios', 26, 'MID', 77],
    ['Lamine Yamal', 19, 'FWD', 86], ['Nico Williams', 17, 'FWD', 84], ['Álvaro Morata', 7, 'FWD', 82],
    ['Mikel Oyarzabal', 21, 'FWD', 82], ['Ferran Torres', 11, 'FWD', 81], ['Ayoze Pérez', 25, 'FWD', 77],
    ['Samu Aghehowa', 12, 'FWD', 78], ['Bryan Gil', 22, 'FWD', 76],
  ]),
  team('cpv', 'Cape Verde', '🇨🇻', ['#003893', '#ffffff'], 'H', 43, [
    ['Vozinha', 1, 'GK', 72], ['Márcio Rosa', 12, 'GK', 68], ['Bruno Varela', 23, 'GK', 73],
    ['Stopira', 3, 'DEF', 72], ['Roberto Lopes', 5, 'DEF', 73], ['Diney', 2, 'DEF', 71],
    ['Kenny Rocha Santos', 6, 'DEF', 71], ['Steven Moreira', 4, 'DEF', 73], ['Logan Costa', 15, 'DEF', 76],
    ['Sidny Cabral', 17, 'DEF', 71], ['Dylan Tavares', 13, 'DEF', 70],
    ['Deroy Duarte', 8, 'MID', 73], ['Laros Duarte', 18, 'MID', 72], ['Jamiro Monteiro', 10, 'MID', 74],
    ['Kevin Pina', 7, 'MID', 72], ['Pico', 16, 'MID', 71], ['Telma Encarnação', 20, 'MID', 71],
    ['Gilson Benchimol', 21, 'MID', 72],
    ['Garry Rodrigues', 11, 'FWD', 74], ['Ryan Mendes', 9, 'FWD', 73], ['Willy Semedo', 17, 'FWD', 72],
    ['Bebé', 19, 'FWD', 73], ['Dailon Rocha Livramento', 24, 'FWD', 72], ['Júlio Tavares', 25, 'FWD', 71],
    ['Patrick Andrade', 26, 'MID', 72], ['Yannick Semedo', 22, 'FWD', 71],
  ]),
  team('ksa', 'Saudi Arabia', '🇸🇦', ['#006c35', '#ffffff'], 'H', 39, [
    ['Mohammed Al-Owais', 21, 'GK', 73], ['Nawaf Al-Aqidi', 1, 'GK', 70], ['Ahmed Al-Kassar', 22, 'GK', 70],
    ['Ali Al-Bulayhi', 5, 'DEF', 73], ['Hassan Tambakti', 3, 'DEF', 72], ['Saud Abdulhamid', 2, 'DEF', 73],
    ['Sultan Al-Ghannam', 13, 'DEF', 72], ['Ali Lajami', 4, 'DEF', 72], ['Abdullah Madu', 6, 'DEF', 72],
    ['Hassan Kadesh', 15, 'DEF', 71], ['Mohammed Al-Brik', 16, 'DEF', 71],
    ['Mohamed Kanno', 28, 'MID', 73], ['Nasser Al-Dawsari', 14, 'MID', 73], ['Salem Al-Dawsari', 10, 'MID', 78],
    ['Abdulrahman Ghareeb', 11, 'MID', 73], ['Musab Al-Juwayr', 7, 'MID', 73], ['Sami Al-Najei', 23, 'MID', 72],
    ['Ali Al-Hassan', 8, 'MID', 72],
    ['Firas Al-Buraikan', 9, 'FWD', 75], ['Saleh Al-Shehri', 20, 'FWD', 73], ['Abdullah Radif', 18, 'FWD', 72],
    ['Salem Al-Najdi', 24, 'FWD', 72], ['Marwan Al-Sahafi', 25, 'FWD', 71], ['Feras Al-Brikan', 26, 'FWD', 73],
    ['Abdullah Al-Hamdan', 17, 'FWD', 73], ['Abdulelah Al-Malki', 8, 'MID', 73],
  ]),
  team('uru', 'Uruguay', '🇺🇾', ['#5cb7eb', '#ffffff'], 'H', 11, [
    ['Sergio Rochet', 23, 'GK', 77], ['Santiago Mele', 1, 'GK', 73], ['Franco Israel', 12, 'GK', 73],
    ['Ronald Araújo', 4, 'DEF', 84], ['José María Giménez', 2, 'DEF', 83], ['Mathías Olivera', 17, 'DEF', 79],
    ['Nahitan Nández', 16, 'DEF', 77], ['Sebastián Cáceres', 3, 'DEF', 76], ['Guillermo Varela', 22, 'DEF', 75],
    ['Santiago Bueno', 5, 'DEF', 75], ['Joaquín Piquerez', 15, 'DEF', 77],
    ['Federico Valverde', 15, 'MID', 88], ['Manuel Ugarte', 5, 'MID', 80], ['Rodrigo Bentancur', 6, 'MID', 81],
    ['Nicolás de la Cruz', 10, 'MID', 80], ['Facundo Pellistri', 11, 'MID', 77], ['Giorgian de Arrascaeta', 10, 'MID', 81],
    ['Emiliano Martínez', 20, 'MID', 75],
    ['Darwin Núñez', 9, 'FWD', 83], ['Federico Viñas', 19, 'FWD', 75], ['Maximiliano Araújo', 7, 'FWD', 76],
    ['Brian Rodríguez', 18, 'FWD', 76], ['Rodrigo Aguirre', 24, 'FWD', 74], ['Cristian Olivera', 25, 'FWD', 74],
    ['Luciano Rodríguez', 26, 'FWD', 75], ['Agustín Canobbio', 13, 'FWD', 74],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP I — France, Senegal, Iraq, Norway
// ─────────────────────────────────────────────────────────────────────────────
const I: SquadTeam[] = [
  team('fra', 'France', '🇫🇷', ['#1e3a8a', '#ffffff'], 'I', 2, [
    ['Mike Maignan', 1, 'GK', 86], ['Brice Samba', 16, 'GK', 78], ['Lucas Chevalier', 23, 'GK', 80],
    ['William Saliba', 17, 'DEF', 85], ['Dayot Upamecano', 4, 'DEF', 83], ['Theo Hernández', 22, 'DEF', 84],
    ['Jules Koundé', 5, 'DEF', 84], ['Ibrahima Konaté', 15, 'DEF', 83], ['Lucas Digne', 3, 'DEF', 78],
    ['Malo Gusto', 2, 'DEF', 77], ['Jonathan Clauss', 24, 'DEF', 76],
    ['Aurélien Tchouaméni', 8, 'MID', 85], ['Eduardo Camavinga', 6, 'MID', 84], ['Adrien Rabiot', 14, 'MID', 82],
    ['Warren Zaïre-Emery', 18, 'MID', 80], ['Manu Koné', 13, 'MID', 79], ['Khéphren Thuram', 26, 'MID', 79],
    ['N’Golo Kanté', 25, 'MID', 81],
    ['Antoine Griezmann', 7, 'FWD', 85], ['Kylian Mbappé', 10, 'FWD', 91], ['Ousmane Dembélé', 11, 'FWD', 86],
    ['Marcus Thuram', 9, 'FWD', 82], ['Randal Kolo Muani', 12, 'FWD', 81], ['Bradley Barcola', 20, 'FWD', 82],
    ['Michael Olise', 19, 'FWD', 84], ['Hugo Ekitike', 21, 'FWD', 80],
  ]),
  team('sen', 'Senegal', '🇸🇳', ['#00853f', '#fdef42'], 'I', 18, [
    ['Édouard Mendy', 16, 'GK', 81], ['Mory Diaw', 1, 'GK', 73], ['Yehvann Diouf', 23, 'GK', 73],
    ['Kalidou Koulibaly', 3, 'DEF', 82], ['Abdou Diallo', 22, 'DEF', 78], ['Ismail Jakobs', 12, 'DEF', 76],
    ['Youssouf Sabaly', 21, 'DEF', 76], ['Moussa Niakhaté', 5, 'DEF', 77], ['Antoine Mendy', 2, 'DEF', 74],
    ['El Hadji Malick Diouf', 15, 'DEF', 75], ['Formose Mendy', 4, 'DEF', 74],
    ['Idrissa Gueye', 5, 'MID', 79], ['Pape Matar Sarr', 17, 'MID', 79], ['Pape Gueye', 6, 'MID', 76],
    ['Krépin Diatta', 11, 'MID', 77], ['Lamine Camara', 13, 'MID', 77], ['Pathé Ciss', 20, 'MID', 74],
    ['Habib Diarra', 14, 'MID', 76],
    ['Sadio Mané', 10, 'FWD', 84], ['Nicolas Jackson', 9, 'FWD', 80], ['Ismaïla Sarr', 18, 'FWD', 79],
    ['Boulaye Dia', 19, 'FWD', 77], ['Habib Diallo', 7, 'FWD', 75], ['Iliman Ndiaye', 8, 'FWD', 79],
    ['Chérif Ndiaye', 24, 'FWD', 73], ['Assane Diao', 25, 'FWD', 76],
  ]),
  team('irq', 'Iraq', '🇮🇶', ['#ffffff', '#ce1126'], 'I', 41, [
    ['Jalal Hassan', 1, 'GK', 72], ['Ahmad Basil', 22, 'GK', 69], ['Fahad Talib', 12, 'GK', 70],
    ['Rebin Sulaka', 3, 'DEF', 72], ['Merchas Doski', 2, 'DEF', 72], ['Akam Hashim', 5, 'DEF', 71],
    ['Hussein Ali', 4, 'DEF', 71], ['Zaid Tahseen', 6, 'DEF', 70], ['Mustafa Nadhim', 15, 'DEF', 70],
    ['Saad Natiq', 13, 'DEF', 71], ['Frans Putros', 16, 'DEF', 71],
    ['Amir Al-Ammari', 8, 'MID', 74], ['Ibrahim Bayesh', 10, 'MID', 73], ['Bashar Resan', 17, 'MID', 72],
    ['Zidane Iqbal', 14, 'MID', 73], ['Osama Rashid', 15, 'MID', 72], ['Sajad Jassim', 18, 'MID', 71],
    ['Hussein Jabbar', 20, 'MID', 71],
    ['Aymen Hussein', 9, 'FWD', 74], ['Ali Al-Hamadi', 11, 'FWD', 74], ['Mohanad Ali', 20, 'FWD', 73],
    ['Ali Jasim', 7, 'FWD', 73], ['Youssef Amyn', 24, 'FWD', 73], ['Aso Rostam', 25, 'FWD', 71],
    ['Manaf Younis', 26, 'MID', 71], ['Hassan Abdulkareem', 19, 'FWD', 71],
  ]),
  team('nor', 'Norway', '🇳🇴', ['#ba0c2f', '#00205b'], 'I', 20, [
    ['Ørjan Nyland', 12, 'GK', 74], ['Egil Selvik', 1, 'GK', 71], ['Mads Hansen', 23, 'GK', 70],
    ['Kristoffer Ajer', 4, 'DEF', 77], ['Leo Østigård', 5, 'DEF', 75], ['Julian Ryerson', 2, 'DEF', 76],
    ['David Møller Wolfe', 3, 'DEF', 73], ['Stian Gregersen', 6, 'DEF', 74], ['Marcus Pedersen', 16, 'DEF', 73],
    ['Andreas Hanche-Olsen', 15, 'DEF', 74], ['Birger Meling', 13, 'DEF', 74],
    ['Martin Ødegaard', 10, 'MID', 87], ['Sander Berge', 6, 'MID', 78], ['Patrick Berg', 8, 'MID', 74],
    ['Fredrik Aursnes', 15, 'MID', 77], ['Morten Thorsby', 14, 'MID', 74], ['Aron Dønnum', 20, 'MID', 73],
    ['Mats Møller Dæhli', 21, 'MID', 73],
    ['Antonio Nusa', 7, 'FWD', 79], ['Erling Haaland', 9, 'FWD', 91], ['Alexander Sørloth', 11, 'FWD', 81],
    ['Oscar Bobb', 17, 'FWD', 77], ['Jørgen Strand Larsen', 19, 'FWD', 77], ['Andreas Schjelderup', 24, 'FWD', 76],
    ['Ola Solbakken', 25, 'FWD', 74], ['Thelo Aasgaard', 26, 'MID', 75],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP J — Argentina, Algeria, Austria, Jordan
// ─────────────────────────────────────────────────────────────────────────────
const J: SquadTeam[] = [
  team('arg', 'Argentina', '🇦🇷', ['#75aadb', '#ffffff'], 'J', 1, [
    ['Emiliano Martínez', 23, 'GK', 86], ['Gerónimo Rulli', 12, 'GK', 78], ['Walter Benítez', 1, 'GK', 77],
    ['Cuti Romero', 13, 'DEF', 86], ['Lisandro Martínez', 25, 'DEF', 84], ['Nicolás Otamendi', 19, 'DEF', 81],
    ['Nahuel Molina', 26, 'DEF', 80], ['Nicolás Tagliafico', 3, 'DEF', 79], ['Gonzalo Montiel', 4, 'DEF', 78],
    ['Marcos Acuña', 8, 'DEF', 77], ['Leonardo Balerdi', 2, 'DEF', 78],
    ['Rodrigo De Paul', 7, 'MID', 84], ['Enzo Fernández', 24, 'MID', 85], ['Alexis Mac Allister', 20, 'MID', 86],
    ['Leandro Paredes', 5, 'MID', 79], ['Giovani Lo Celso', 21, 'MID', 80], ['Exequiel Palacios', 14, 'MID', 80],
    ['Thiago Almada', 16, 'MID', 80],
    ['Lionel Messi', 10, 'FWD', 90], ['Julián Álvarez', 9, 'FWD', 87], ['Lautaro Martínez', 22, 'FWD', 87],
    ['Franco Mastantuono', 11, 'FWD', 79], ['Nico González', 15, 'FWD', 80], ['Giuliano Simeone', 17, 'FWD', 78],
    ['Alejandro Garnacho', 18, 'FWD', 81], ['Valentín Carboni', 6, 'MID', 77],
  ]),
  team('alg', 'Algeria', '🇩🇿', ['#006233', '#ffffff'], 'J', 29, [
    ['Anthony Mandrea', 1, 'GK', 73], ['Alexandre Oukidja', 16, 'GK', 72], ['Oussama Benbot', 23, 'GK', 71],
    ['Aïssa Mandi', 4, 'DEF', 76], ['Ramy Bensebaini', 5, 'DEF', 78], ['Youcef Atal', 2, 'DEF', 75],
    ['Mohamed Amine Tougai', 3, 'DEF', 73], ['Jaouen Hadjam', 15, 'DEF', 74], ['Ahmed Touba', 6, 'DEF', 73],
    ['Rayan Aït-Nouri', 12, 'DEF', 79], ['Mohamed Farsi', 17, 'DEF', 73],
    ['Ismaël Bennacer', 8, 'MID', 80], ['Houssem Aouar', 11, 'MID', 78], ['Nabil Bentaleb', 6, 'MID', 74],
    ['Ramiz Zerrouki', 13, 'MID', 74], ['Adam Ounas', 14, 'MID', 75], ['Hicham Boudaoui', 20, 'MID', 74],
    ['Ibrahim Maza', 21, 'MID', 76],
    ['Riyad Mahrez', 7, 'FWD', 83], ['Saïd Benrahma', 10, 'FWD', 78], ['Amine Gouiri', 9, 'FWD', 78],
    ['Baghdad Bounedjah', 17, 'FWD', 75], ['Mohamed Amoura', 18, 'FWD', 79], ['Yassine Benzia', 24, 'FWD', 73],
    ['Islam Slimani', 25, 'FWD', 73], ['Badredine Bouanani', 26, 'FWD', 75],
  ]),
  team('aut', 'Austria', '🇦🇹', ['#ed2939', '#ffffff'], 'J', 30, [
    ['Patrick Pentz', 1, 'GK', 76], ['Niklas Hedl', 21, 'GK', 73], ['Tobias Lawal', 23, 'GK', 72],
    ['David Alaba', 8, 'DEF', 82], ['Kevin Danso', 4, 'DEF', 78], ['Philipp Lienhart', 5, 'DEF', 76],
    ['Maximilian Wöber', 18, 'DEF', 76], ['Stefan Posch', 2, 'DEF', 76], ['Phillipp Mwene', 3, 'DEF', 74],
    ['Flavius Daniliuc', 15, 'DEF', 73], ['Leopold Querfeld', 16, 'DEF', 74],
    ['Konrad Laimer', 6, 'MID', 80], ['Nicolas Seiwald', 13, 'MID', 78], ['Christoph Baumgartner', 19, 'MID', 80],
    ['Marcel Sabitzer', 9, 'MID', 81], ['Florian Grillitsch', 7, 'MID', 76], ['Romano Schmid', 22, 'MID', 74],
    ['Patrick Wimmer', 20, 'MID', 75],
    ['Marko Arnautović', 17, 'FWD', 77], ['Michael Gregoritsch', 14, 'FWD', 76], ['Alexander Prass', 10, 'MID', 75],
    ['Maximilian Entrup', 24, 'FWD', 73], ['Junior Adamu', 25, 'FWD', 74], ['Marco Grüll', 26, 'FWD', 74],
    ['Andreas Weimann', 11, 'FWD', 73], ['Xaver Schlager', 12, 'MID', 79],
  ]),
  team('jor', 'Jordan', '🇯🇴', ['#ce1126', '#ffffff'], 'J', 42, [
    ['Yazeed Abulaila', 1, 'GK', 72], ['Abdullah Al-Fakhouri', 22, 'GK', 69], ['Yazid Abulaila', 23, 'GK', 68],
    ['Yazan Al-Arab', 5, 'DEF', 72], ['Salem Al-Ajalin', 4, 'DEF', 71], ['Abdallah Nasib', 3, 'DEF', 71],
    ['Ihsan Haddad', 2, 'DEF', 71], ['Bara Marei', 6, 'DEF', 70], ['Mohannad Abu Taha', 15, 'DEF', 71],
    ['Mahmoud Al-Mardi', 16, 'DEF', 71], ['Salem Al-Rashdan', 13, 'DEF', 70],
    ['Noor Al-Rawabdeh', 8, 'MID', 73], ['Nizar Al-Rashdan', 17, 'MID', 73], ['Ehsan Haddad', 14, 'MID', 71],
    ['Rajaei Ayed', 7, 'MID', 71], ['Mohammad Abu Zraiq', 18, 'MID', 71], ['Odai Al-Saify', 20, 'MID', 71],
    ['Abdallah Al-Naqbi', 21, 'MID', 70],
    ['Mousa Al-Taamari', 10, 'FWD', 79], ['Yazan Al-Naimat', 9, 'FWD', 74], ['Ali Olwan', 11, 'FWD', 73],
    ['Mahmoud Al-Aradi', 24, 'FWD', 71], ['Anas Al-Awadat', 25, 'FWD', 71], ['Mohammad Al-Dmeiri', 26, 'FWD', 71],
    ['Hamza Al-Dardour', 19, 'FWD', 72], ['Saeed Al-Rosan', 12, 'MID', 70],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP K — Portugal, DR Congo, Uzbekistan, Colombia
// ─────────────────────────────────────────────────────────────────────────────
const K: SquadTeam[] = [
  team('por', 'Portugal', '🇵🇹', ['#006600', '#ff0000'], 'K', 6, [
    ['Diogo Costa', 22, 'GK', 84], ['Rui Patrício', 1, 'GK', 78], ['José Sá', 12, 'GK', 79],
    ['Rúben Dias', 3, 'DEF', 86], ['Tomás Araújo', 13, 'DEF', 77], ['João Cancelo', 20, 'DEF', 84],
    ['Nuno Mendes', 19, 'DEF', 83], ['Gonçalo Inácio', 4, 'DEF', 80], ['Diogo Dalot', 2, 'DEF', 82],
    ['António Silva', 5, 'DEF', 79], ['Renato Veiga', 14, 'DEF', 78],
    ['Bruno Fernandes', 8, 'MID', 87], ['Vitinha', 16, 'MID', 84], ['Rúben Neves', 18, 'MID', 81],
    ['Bernardo Silva', 10, 'MID', 87], ['João Neves', 23, 'MID', 82], ['João Palhinha', 6, 'MID', 82],
    ['Otávio', 25, 'MID', 78],
    ['Cristiano Ronaldo', 7, 'FWD', 84], ['Rafael Leão', 17, 'FWD', 85], ['Gonçalo Ramos', 26, 'FWD', 81],
    ['João Félix', 11, 'FWD', 81], ['Pedro Neto', 21, 'FWD', 81], ['Francisco Conceição', 9, 'FWD', 80],
    ['Diogo Jota', 24, 'FWD', 83], ['Geovany Quenda', 15, 'FWD', 76],
  ]),
  team('cod', 'DR Congo', '🇨🇩', ['#007fff', '#f7d518'], 'K', 30, [
    ['Lionel Mpasi', 1, 'GK', 74], ['Timothy Fayulu', 16, 'GK', 71], ['Dimitry Bertaud', 23, 'GK', 73],
    ['Chancel Mbemba', 4, 'DEF', 80], ['Arthur Masuaku', 3, 'DEF', 76], ['Gédéon Kalulu', 2, 'DEF', 74],
    ['Axel Tuanzebe', 5, 'DEF', 73], ['Rocky Bushiri', 15, 'DEF', 72], ['Aaron Wan-Bissaka', 17, 'DEF', 79],
    ['Joris Kayembe', 13, 'DEF', 73], ['Dénis Zakaria', 6, 'DEF', 74],
    ['Charles Pickel', 6, 'MID', 75], ['Samuel Moutoussamy', 8, 'MID', 74], ['Edo Kayembe', 17, 'MID', 74],
    ['Théo Bongonda', 11, 'MID', 76], ['Grady Diangana', 20, 'MID', 74], ['Noah Sadiki', 14, 'MID', 76],
    ['Brakelard Kindjo', 21, 'MID', 72],
    ['Yoane Wissa', 9, 'FWD', 80], ['Cédric Bakambu', 13, 'FWD', 76], ['Silas', 7, 'FWD', 77],
    ['Meschack Elia', 10, 'FWD', 75], ['Fiston Mayele', 18, 'FWD', 76], ['Simon Banza', 24, 'FWD', 76],
    ['Wilfried Kanga', 25, 'FWD', 74], ['Chico Lamba', 26, 'DEF', 73],
  ]),
  team('uzb', 'Uzbekistan', '🇺🇿', ['#1eb53a', '#0099b5'], 'K', 38, [
    ['Utkir Yusupov', 1, 'GK', 71], ['Abduvohid Nematov', 12, 'GK', 69], ['Vladimir Nazarov', 23, 'GK', 69],
    ['Abdukodir Khusanov', 4, 'DEF', 77], ['Rustamjon Ashurmatov', 3, 'DEF', 72], ['Sherzod Nasrullaev', 2, 'DEF', 71],
    ['Farrukh Sayfiev', 5, 'DEF', 71], ['Khusniddin Alikulov', 10, 'DEF', 72], ['Bobur Abdikholikov', 15, 'DEF', 73],
    ['Umarali Rahmonaliev', 16, 'DEF', 71], ['Akramjon Komilov', 13, 'DEF', 71],
    ['Jaloliddin Masharipov', 7, 'MID', 74], ['Otabek Shukurov', 6, 'MID', 72], ['Azizbek Turgunboev', 11, 'MID', 71],
    ['Khojimat Erkinov', 14, 'MID', 71], ['Jasurbek Jaloliddinov', 20, 'MID', 71], ['Odiljon Hamrobekov', 8, 'MID', 72],
    ['Abdurauf Buriev', 21, 'MID', 71],
    ['Eldor Shomurodov', 9, 'FWD', 77], ['Igor Sergeev', 17, 'FWD', 72], ['Oston Urunov', 18, 'FWD', 71],
    ['Khojiakbar Alijonov', 24, 'FWD', 71], ['Jamshid Iskanderov', 22, 'MID', 71], ['Abbosbek Fayzullaev', 25, 'MID', 76],
    ['Sardor Mukhamedov', 26, 'DEF', 71], ['Dostonbek Khamdamov', 19, 'FWD', 73],
  ]),
  team('col', 'Colombia', '🇨🇴', ['#fcd116', '#003893'], 'K', 13, [
    ['Camilo Vargas', 1, 'GK', 76], ['David Ospina', 12, 'GK', 75], ['Álvaro Montero', 23, 'GK', 73],
    ['Dávinson Sánchez', 23, 'DEF', 80], ['Yerry Mina', 13, 'DEF', 77], ['Daniel Muñoz', 4, 'DEF', 79],
    ['Johan Mojica', 17, 'DEF', 76], ['Carlos Cuesta', 2, 'DEF', 75], ['Jhon Lucumí', 3, 'DEF', 77],
    ['Deiver Machado', 15, 'DEF', 74], ['Santiago Arias', 16, 'DEF', 73],
    ['Richard Ríos', 15, 'MID', 79], ['Jefferson Lerma', 16, 'MID', 78], ['James Rodríguez', 10, 'MID', 81],
    ['Jhon Arias', 7, 'MID', 79], ['Jorge Carrascal', 8, 'MID', 76], ['Kevin Castaño', 5, 'MID', 76],
    ['Juan Fernando Quintero', 20, 'MID', 76],
    ['Luis Díaz', 11, 'FWD', 85], ['Jhon Durán', 9, 'FWD', 80], ['Rafael Santos Borré', 19, 'FWD', 76],
    ['Luis Sinisterra', 22, 'FWD', 78], ['Dayro Moreno', 24, 'FWD', 73], ['Marino Hinestroza', 25, 'FWD', 75],
    ['Jhon Córdoba', 26, 'FWD', 76], ['Yaser Asprilla', 14, 'MID', 76],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP L — England, Croatia, Ghana, Panama
// ─────────────────────────────────────────────────────────────────────────────
const L: SquadTeam[] = [
  team('eng', 'England', '🏴', ['#ffffff', '#1e3a8a'], 'L', 4, [
    ['Jordan Pickford', 1, 'GK', 83], ['Dean Henderson', 13, 'GK', 78], ['James Trafford', 23, 'GK', 78],
    ['Kyle Walker', 2, 'DEF', 80], ['John Stones', 5, 'DEF', 84], ['Marc Guéhi', 6, 'DEF', 80],
    ['Ezri Konsa', 14, 'DEF', 78], ['Trent Alexander-Arnold', 12, 'DEF', 84], ['Levi Colwill', 15, 'DEF', 80],
    ['Myles Lewis-Skelly', 3, 'DEF', 78], ['Tino Livramento', 22, 'DEF', 77],
    ['Declan Rice', 4, 'MID', 86], ['Jude Bellingham', 10, 'MID', 88], ['Phil Foden', 11, 'MID', 86],
    ['Cole Palmer', 24, 'MID', 85], ['Adam Wharton', 16, 'MID', 79], ['Morgan Rogers', 26, 'MID', 79],
    ['Conor Gallagher', 8, 'MID', 80],
    ['Harry Kane', 9, 'FWD', 89], ['Bukayo Saka', 7, 'FWD', 86], ['Anthony Gordon', 17, 'FWD', 80],
    ['Ollie Watkins', 18, 'FWD', 81], ['Eberechi Eze', 25, 'FWD', 81], ['Marcus Rashford', 19, 'FWD', 82],
    ['Jarrod Bowen', 20, 'FWD', 80], ['Noni Madueke', 21, 'FWD', 79],
  ]),
  team('cro', 'Croatia', '🇭🇷', ['#ff0000', '#ffffff'], 'L', 9, [
    ['Dominik Livaković', 1, 'GK', 80], ['Ivica Ivušić', 23, 'GK', 74], ['Nediljko Labrović', 12, 'GK', 73],
    ['Joško Gvardiol', 20, 'DEF', 85], ['Josip Stanišić', 2, 'DEF', 78], ['Borna Sosa', 19, 'DEF', 77],
    ['Josip Šutalo', 6, 'DEF', 77], ['Marin Pongračić', 5, 'DEF', 76], ['Domagoj Vida', 21, 'DEF', 74],
    ['Martin Erlić', 3, 'DEF', 75], ['Duje Ćaleta-Car', 4, 'DEF', 74],
    ['Luka Modrić', 10, 'MID', 84], ['Mateo Kovačić', 8, 'MID', 83], ['Marcelo Brozović', 11, 'MID', 82],
    ['Lovro Majer', 7, 'MID', 79], ['Mario Pašalić', 15, 'MID', 78], ['Luka Sučić', 25, 'MID', 76],
    ['Nikola Vlašić', 13, 'MID', 78], ['Petar Sučić', 14, 'MID', 76],
    ['Andrej Kramarić', 9, 'FWD', 79], ['Ante Budimir', 17, 'FWD', 76], ['Marko Pjaca', 16, 'FWD', 74],
    ['Igor Matanović', 24, 'FWD', 73], ['Dion Drena Beljo', 26, 'FWD', 73], ['Marco Pašalić', 18, 'FWD', 74],
    ['Franjo Ivanović', 22, 'FWD', 74],
  ]),
  team('gha', 'Ghana', '🇬🇭', ['#ce1126', '#ffd700'], 'L', 33, [
    ['Lawrence Ati-Zigi', 1, 'GK', 73], ['Joseph Wollacott', 12, 'GK', 71], ['Benjamin Asare', 23, 'GK', 70],
    ['Alexander Djiku', 5, 'DEF', 75], ['Mohammed Salisu', 18, 'DEF', 77], ['Gideon Mensah', 3, 'DEF', 73],
    ['Tariq Lamptey', 2, 'DEF', 76], ['Alidu Seidu', 4, 'DEF', 74], ['Jerome Opoku', 15, 'DEF', 73],
    ['Kingsley Schindler', 13, 'DEF', 72], ['Razak Simpson', 16, 'DEF', 72],
    ['Thomas Partey', 8, 'MID', 82], ['Mohammed Kudus', 20, 'MID', 83], ['Elisha Owusu', 6, 'MID', 73],
    ['Majeed Ashimeru', 21, 'MID', 73], ['Lawrence Agyekum', 14, 'MID', 73], ['Salis Abdul Samed', 17, 'MID', 74],
    ['Abu Francis', 22, 'MID', 72],
    ['Jordan Ayew', 10, 'FWD', 77], ['Iñaki Williams', 19, 'FWD', 79], ['Antoine Semenyo', 9, 'FWD', 78],
    ['Kamaldeen Sulemana', 7, 'FWD', 76], ['Ernest Nuamah', 11, 'FWD', 75], ['Brandon Thomas-Asante', 24, 'FWD', 73],
    ['Christopher Bonsu Baah', 25, 'FWD', 74], ['Fatawu Issahaku', 26, 'FWD', 76],
  ]),
  team('pan', 'Panama', '🇵🇦', ['#005293', '#db0a16'], 'L', 45, [
    ['Orlando Mosquera', 1, 'GK', 72], ['Luis Mejía', 22, 'GK', 71], ['José Guerra', 23, 'GK', 70],
    ['Fidel Escobar', 5, 'DEF', 72], ['Andrés Andrade', 17, 'DEF', 72], ['Eric Davis', 15, 'DEF', 72],
    ['Michael Murillo', 13, 'DEF', 74], ['Roderick Miller', 4, 'DEF', 72], ['César Blackman', 2, 'DEF', 72],
    ['Carlos Harvey', 6, 'DEF', 72], ['Jorge Gutiérrez', 3, 'DEF', 71],
    ['Aníbal Godoy', 20, 'MID', 73], ['Cristian Martínez', 19, 'MID', 72], ['Adalberto Carrasquilla', 6, 'MID', 74],
    ['Édgar Bárcenas', 7, 'MID', 73], ['Tomás Rodríguez', 14, 'MID', 71], ['Abdiel Ayarza', 8, 'MID', 72],
    ['Ernesto Walker', 21, 'MID', 71],
    ['Ismael Díaz', 10, 'FWD', 73], ['José Fajardo', 9, 'FWD', 72], ['Cecilio Waterman', 11, 'FWD', 72],
    ['Azarías Londoño', 18, 'FWD', 71], ['Eduardo Guerrero', 24, 'FWD', 71], ['Edward Cedeño', 25, 'MID', 72],
    ['José Córdoba', 26, 'DEF', 73], ['Yoel Bárcenas', 12, 'MID', 73],
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
