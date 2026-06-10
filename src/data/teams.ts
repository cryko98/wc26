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
//  // TODO: verify/replace with the official 2026 World Cup group draw.
//  The 48 nations below are distributed across 12 groups (A–L) of 4 in a
//  plausible, balanced, easily-editable layout. Swap groups freely.
// ═════════════════════════════════════════════════════════════════════════════

export interface SquadTeam extends Team {
  players: Player[]
}

// Compact player tuple: [name, number, position, rating]
type P = [string, number, Position, number]

let _autoRank = 0

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

void _autoRank // reserved for future auto-seeding helpers

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP A
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
  team('cro', 'Croatia', '🇭🇷', ['#ff0000', '#ffffff'], 'A', 9, [
    ['Dominik Livaković', 1, 'GK', 80], ['Ivica Ivušić', 23, 'GK', 74],
    ['Joško Gvardiol', 20, 'DEF', 85], ['Josip Stanišić', 2, 'DEF', 78],
    ['Borna Sosa', 19, 'DEF', 77], ['Josip Šutalo', 6, 'DEF', 77],
    ['Luka Modrić', 10, 'MID', 84], ['Mateo Kovačić', 8, 'MID', 83],
    ['Marcelo Brozović', 11, 'MID', 82], ['Lovro Majer', 7, 'MID', 79],
    ['Mario Pašalić', 15, 'MID', 78], ['Andrej Kramarić', 9, 'FWD', 79],
    ['Ante Budimir', 17, 'FWD', 76], ['Marko Pjaca', 14, 'FWD', 74],
    ['Luka Sučić', 25, 'MID', 76],
  ]),
  team('uru', 'Uruguay', '🇺🇾', ['#5cb7eb', '#ffffff'], 'A', 11, [
    ['Sergio Rochet', 23, 'GK', 77], ['Santiago Mele', 1, 'GK', 73],
    ['Ronald Araújo', 4, 'DEF', 84], ['José María Giménez', 2, 'DEF', 83],
    ['Mathías Olivera', 17, 'DEF', 79], ['Nahitan Nández', 16, 'DEF', 77],
    ['Federico Valverde', 15, 'MID', 88], ['Manuel Ugarte', 5, 'MID', 80],
    ['Rodrigo Bentancur', 6, 'MID', 81], ['Nicolás de la Cruz', 10, 'MID', 80],
    ['Facundo Pellistri', 11, 'MID', 77], ['Darwin Núñez', 9, 'FWD', 83],
    ['Federico Viñas', 19, 'FWD', 75], ['Maximiliano Araújo', 7, 'FWD', 76],
    ['Brian Rodríguez', 20, 'FWD', 76],
  ]),
  team('gha', 'Ghana', '🇬🇭', ['#ce1126', '#ffd700'], 'A', 36, [
    ['Lawrence Ati-Zigi', 1, 'GK', 73], ['Joseph Wollacott', 12, 'GK', 71],
    ['Alexander Djiku', 5, 'DEF', 75], ['Mohammed Salisu', 18, 'DEF', 77],
    ['Gideon Mensah', 3, 'DEF', 73], ['Tariq Lamptey', 2, 'DEF', 76],
    ['Thomas Partey', 5, 'MID', 82], ['Mohammed Kudus', 20, 'MID', 83],
    ['Elisha Owusu', 8, 'MID', 73], ['Majeed Ashimeru', 21, 'MID', 73],
    ['Jordan Ayew', 10, 'FWD', 77], ['Iñaki Williams', 19, 'FWD', 79],
    ['Antoine Semenyo', 9, 'FWD', 78], ['Kamaldeen Sulemana', 7, 'FWD', 76],
    ['Ernest Nuamah', 14, 'FWD', 75],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP B
// ─────────────────────────────────────────────────────────────────────────────
const B: SquadTeam[] = [
  team('arg', 'Argentina', '🇦🇷', ['#75aadb', '#ffffff'], 'B', 1, [
    ['Emiliano Martínez', 23, 'GK', 86], ['Gerónimo Rulli', 12, 'GK', 78],
    ['Cuti Romero', 13, 'DEF', 86], ['Lisandro Martínez', 25, 'DEF', 84],
    ['Nicolás Otamendi', 19, 'DEF', 81], ['Nahuel Molina', 26, 'DEF', 80],
    ['Nicolás Tagliafico', 3, 'DEF', 79], ['Rodrigo De Paul', 7, 'MID', 84],
    ['Enzo Fernández', 24, 'MID', 85], ['Alexis Mac Allister', 20, 'MID', 86],
    ['Lionel Messi', 10, 'FWD', 90], ['Julián Álvarez', 9, 'FWD', 87],
    ['Lautaro Martínez', 22, 'FWD', 87], ['Ángel Di María', 11, 'FWD', 82],
    ['Giovani Lo Celso', 21, 'MID', 80],
  ]),
  team('pol', 'Poland', '🇵🇱', ['#ffffff', '#dc143c'], 'B', 28, [
    ['Wojciech Szczęsny', 1, 'GK', 83], ['Łukasz Skorupski', 12, 'GK', 76],
    ['Jan Bednarek', 5, 'DEF', 78], ['Jakub Kiwior', 4, 'DEF', 78],
    ['Matty Cash', 2, 'DEF', 78], ['Bartosz Bereszyński', 20, 'DEF', 74],
    ['Piotr Zieliński', 20, 'MID', 82], ['Sebastian Szymański', 10, 'MID', 79],
    ['Nicola Zalewski', 21, 'MID', 76], ['Jakub Moder', 16, 'MID', 75],
    ['Przemysław Frankowski', 14, 'MID', 75], ['Robert Lewandowski', 9, 'FWD', 86],
    ['Krzysztof Piątek', 23, 'FWD', 75], ['Karol Świderski', 11, 'FWD', 74],
    ['Adam Buksa', 18, 'FWD', 74],
  ]),
  team('sen', 'Senegal', '🇸🇳', ['#00853f', '#fdef42'], 'B', 18, [
    ['Édouard Mendy', 16, 'GK', 81], ['Mory Diaw', 1, 'GK', 73],
    ['Kalidou Koulibaly', 3, 'DEF', 82], ['Abdou Diallo', 22, 'DEF', 78],
    ['Ismail Jakobs', 12, 'DEF', 76], ['Youssouf Sabaly', 21, 'DEF', 76],
    ['Idrissa Gueye', 5, 'MID', 79], ['Pape Matar Sarr', 17, 'MID', 79],
    ['Pape Gueye', 6, 'MID', 76], ['Krépin Diatta', 11, 'MID', 77],
    ['Sadio Mané', 10, 'FWD', 84], ['Nicolas Jackson', 9, 'FWD', 80],
    ['Ismaïla Sarr', 18, 'FWD', 79], ['Boulaye Dia', 19, 'FWD', 77],
    ['Habib Diallo', 13, 'FWD', 75],
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
//  GROUP C
// ─────────────────────────────────────────────────────────────────────────────
const C: SquadTeam[] = [
  team('fra', 'France', '🇫🇷', ['#1e3a8a', '#ffffff'], 'C', 2, [
    ['Mike Maignan', 1, 'GK', 86], ['Brice Samba', 16, 'GK', 78],
    ['William Saliba', 17, 'DEF', 85], ['Dayot Upamecano', 4, 'DEF', 83],
    ['Theo Hernández', 22, 'DEF', 84], ['Jules Koundé', 5, 'DEF', 84],
    ['Aurélien Tchouaméni', 8, 'MID', 85], ['Eduardo Camavinga', 6, 'MID', 84],
    ['Adrien Rabiot', 14, 'MID', 82], ['Antoine Griezmann', 7, 'FWD', 86],
    ['Kylian Mbappé', 10, 'FWD', 91], ['Ousmane Dembélé', 11, 'FWD', 84],
    ['Marcus Thuram', 9, 'FWD', 82], ['Randal Kolo Muani', 12, 'FWD', 81],
    ['Bradley Barcola', 20, 'FWD', 80],
  ]),
  team('aut', 'Austria', '🇦🇹', ['#ed2939', '#ffffff'], 'C', 25, [
    ['Patrick Pentz', 1, 'GK', 76], ['Niklas Hedl', 21, 'GK', 73],
    ['David Alaba', 8, 'DEF', 82], ['Kevin Danso', 4, 'DEF', 78],
    ['Philipp Lienhart', 5, 'DEF', 76], ['Maximilian Wöber', 18, 'DEF', 76],
    ['Konrad Laimer', 6, 'MID', 80], ['Nicolas Seiwald', 13, 'MID', 78],
    ['Christoph Baumgartner', 19, 'MID', 80], ['Marcel Sabitzer', 9, 'MID', 81],
    ['Florian Grillitsch', 7, 'MID', 76], ['Marko Arnautović', 7, 'FWD', 77],
    ['Michael Gregoritsch', 14, 'FWD', 76], ['Patrick Wimmer', 17, 'MID', 75],
    ['Romano Schmid', 20, 'MID', 74],
  ]),
  team('jpn', 'Japan', '🇯🇵', ['#1d2a72', '#ffffff'], 'C', 17, [
    ['Zion Suzuki', 1, 'GK', 78], ['Daniel Schmidt', 12, 'GK', 75],
    ['Ko Itakura', 3, 'DEF', 79], ['Takehiro Tomiyasu', 16, 'DEF', 80],
    ['Hiroki Ito', 22, 'DEF', 78], ['Yukinari Sugawara', 19, 'DEF', 76],
    ['Wataru Endo', 6, 'MID', 80], ['Hidemasa Morita', 13, 'MID', 78],
    ['Daichi Kamada', 15, 'MID', 80], ['Takefusa Kubo', 8, 'MID', 81],
    ['Kaoru Mitoma', 9, 'FWD', 82], ['Takumi Minamino', 10, 'FWD', 79],
    ['Junya Ito', 14, 'FWD', 79], ['Ayase Ueda', 20, 'FWD', 77],
    ['Ritsu Doan', 11, 'FWD', 79],
  ]),
  team('crc', 'Costa Rica', '🇨🇷', ['#002b7f', '#ce1126'], 'C', 40, [
    ['Keylor Navas', 1, 'GK', 79], ['Patrick Sequeira', 23, 'GK', 71],
    ['Óscar Duarte', 19, 'DEF', 72], ['Juan Pablo Vargas', 4, 'DEF', 74],
    ['Francisco Calvo', 15, 'DEF', 73], ['Carlos Martínez', 16, 'DEF', 71],
    ['Celso Borges', 5, 'MID', 73], ['Yeltsin Tejeda', 17, 'MID', 73],
    ['Brandon Aguilera', 7, 'MID', 73], ['Orlando Galo', 20, 'MID', 71],
    ['Joel Campbell', 12, 'FWD', 74], ['Manfred Ugalde', 9, 'FWD', 76],
    ['Anthony Contreras', 21, 'FWD', 72], ['Alonso Martínez', 11, 'FWD', 73],
    ['Josimar Alcócer', 14, 'FWD', 72],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP D
// ─────────────────────────────────────────────────────────────────────────────
const D: SquadTeam[] = [
  team('eng', 'England', '🏴', ['#ffffff', '#1e3a8a'], 'D', 4, [
    ['Jordan Pickford', 1, 'GK', 83], ['Dean Henderson', 13, 'GK', 78],
    ['Kyle Walker', 2, 'DEF', 80], ['John Stones', 5, 'DEF', 84],
    ['Marc Guéhi', 6, 'DEF', 80], ['Ezri Konsa', 14, 'DEF', 78],
    ['Trent Alexander-Arnold', 12, 'DEF', 84], ['Declan Rice', 4, 'MID', 86],
    ['Jude Bellingham', 10, 'MID', 88], ['Phil Foden', 11, 'MID', 86],
    ['Cole Palmer', 24, 'MID', 85], ['Harry Kane', 9, 'FWD', 89],
    ['Bukayo Saka', 7, 'FWD', 86], ['Anthony Gordon', 17, 'FWD', 80],
    ['Ollie Watkins', 18, 'FWD', 81],
  ]),
  team('srb', 'Serbia', '🇷🇸', ['#c6363c', '#ffffff'], 'D', 30, [
    ['Predrag Rajković', 1, 'GK', 76], ['Đorđe Petrović', 23, 'GK', 76],
    ['Nikola Milenković', 4, 'DEF', 80], ['Strahinja Pavlović', 5, 'DEF', 79],
    ['Miloš Veljković', 17, 'DEF', 75], ['Filip Mladenović', 11, 'DEF', 73],
    ['Sergej Milinković-Savić', 20, 'MID', 84], ['Filip Kostić', 13, 'MID', 79],
    ['Saša Lukić', 21, 'MID', 77], ['Nemanja Gudelj', 13, 'MID', 75],
    ['Lazar Samardžić', 18, 'MID', 76], ['Dušan Vlahović', 9, 'FWD', 83],
    ['Aleksandar Mitrović', 9, 'FWD', 81], ['Dušan Tadić', 10, 'FWD', 79],
    ['Luka Jović', 18, 'FWD', 76],
  ]),
  team('kor', 'South Korea', '🇰🇷', ['#ffffff', '#cd2e3a'], 'D', 22, [
    ['Kim Seung-gyu', 21, 'GK', 76], ['Jo Hyeon-woo', 1, 'GK', 76],
    ['Kim Min-jae', 4, 'DEF', 84], ['Kim Young-gwon', 19, 'DEF', 75],
    ['Kim Moon-hwan', 2, 'DEF', 74], ['Lee Ki-je', 14, 'DEF', 73],
    ['Hwang In-beom', 6, 'MID', 79], ['Lee Jae-sung', 17, 'MID', 78],
    ['Park Yong-woo', 5, 'MID', 74], ['Lee Kang-in', 18, 'MID', 81],
    ['Son Heung-min', 7, 'FWD', 85], ['Hwang Hee-chan', 11, 'FWD', 80],
    ['Cho Gue-sung', 9, 'FWD', 76], ['Oh Hyeon-gyu', 22, 'FWD', 74],
    ['Hwang Ui-jo', 16, 'FWD', 74],
  ]),
  team('pan', 'Panama', '🇵🇦', ['#005293', '#db0a16'], 'D', 42, [
    ['Orlando Mosquera', 1, 'GK', 72], ['Luis Mejía', 22, 'GK', 71],
    ['Fidel Escobar', 5, 'DEF', 72], ['Andrés Andrade', 17, 'DEF', 72],
    ['Eric Davis', 15, 'DEF', 72], ['Michael Murillo', 13, 'DEF', 74],
    ['Aníbal Godoy', 20, 'MID', 73], ['Cristian Martínez', 19, 'MID', 72],
    ['Adalberto Carrasquilla', 6, 'MID', 74], ['Édgar Bárcenas', 7, 'MID', 73],
    ['Ismael Díaz', 10, 'FWD', 73], ['José Fajardo', 9, 'FWD', 72],
    ['Cecilio Waterman', 11, 'FWD', 72], ['Azarías Londoño', 21, 'FWD', 71],
    ['Tomás Rodríguez', 14, 'MID', 71],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP E
// ─────────────────────────────────────────────────────────────────────────────
const E: SquadTeam[] = [
  team('bra', 'Brazil', '🇧🇷', ['#ffdf00', '#009b3a'], 'E', 3, [
    ['Alisson', 1, 'GK', 87], ['Ederson', 23, 'GK', 85],
    ['Marquinhos', 4, 'DEF', 85], ['Gabriel Magalhães', 3, 'DEF', 84],
    ['Éder Militão', 3, 'DEF', 83], ['Danilo', 2, 'DEF', 80],
    ['Bruno Guimarães', 5, 'MID', 85], ['Lucas Paquetá', 7, 'MID', 82],
    ['Casemiro', 15, 'MID', 82], ['Rodrygo', 10, 'FWD', 85],
    ['Vinícius Júnior', 7, 'FWD', 89], ['Raphinha', 19, 'FWD', 84],
    ['Endrick', 9, 'FWD', 80], ['Gabriel Martinelli', 18, 'FWD', 81],
    ['Savinho', 11, 'FWD', 80],
  ]),
  team('sco', 'Scotland', '🏴', ['#0065bf', '#ffffff'], 'E', 33, [
    ['Angus Gunn', 1, 'GK', 75], ['Craig Gordon', 12, 'GK', 73],
    ['Andrew Robertson', 3, 'DEF', 82], ['Kieran Tierney', 6, 'DEF', 79],
    ['Jack Hendry', 4, 'DEF', 75], ['Scott McKenna', 5, 'DEF', 74],
    ['Scott McTominay', 4, 'MID', 81], ['Billy Gilmour', 15, 'MID', 77],
    ['John McGinn', 7, 'MID', 80], ['Ryan Christie', 11, 'MID', 75],
    ['Stuart Armstrong', 17, 'MID', 74], ['Che Adams', 9, 'FWD', 76],
    ['Lyndon Dykes', 9, 'FWD', 74], ['Ben Doak', 18, 'FWD', 74],
    ['Lawrence Shankland', 20, 'FWD', 74],
  ]),
  team('nga', 'Nigeria', '🇳🇬', ['#008751', '#ffffff'], 'E', 32, [
    ['Stanley Nwabali', 23, 'GK', 74], ['Francis Uzoho', 1, 'GK', 72],
    ['William Troost-Ekong', 5, 'DEF', 77], ['Calvin Bassey', 21, 'DEF', 77],
    ['Ola Aina', 2, 'DEF', 76], ['Bright Osayi-Samuel', 22, 'DEF', 74],
    ['Wilfred Ndidi', 4, 'MID', 80], ['Alex Iwobi', 18, 'MID', 79],
    ['Frank Onyeka', 8, 'MID', 75], ['Joe Aribo', 6, 'MID', 76],
    ['Victor Osimhen', 9, 'FWD', 86], ['Ademola Lookman', 11, 'FWD', 82],
    ['Samuel Chukwueze', 10, 'FWD', 79], ['Victor Boniface', 20, 'FWD', 80],
    ['Moses Simon', 7, 'FWD', 76],
  ]),
  team('nzl', 'New Zealand', '🇳🇿', ['#ffffff', '#000000'], 'E', 45, [
    ['Alex Paulsen', 1, 'GK', 71], ['Max Crocombe', 12, 'GK', 70],
    ['Tommy Smith', 4, 'DEF', 72], ['Michael Boxall', 5, 'DEF', 72],
    ['Nando Pijnaker', 19, 'DEF', 71], ['Liberato Cacace', 3, 'DEF', 74],
    ['Joe Bell', 6, 'MID', 72], ['Marko Stamenic', 17, 'MID', 72],
    ['Matthew Garbett', 8, 'MID', 72], ['Clément Bates', 14, 'MID', 70],
    ['Chris Wood', 9, 'FWD', 79], ['Ben Waine', 11, 'FWD', 72],
    ['Elijah Just', 7, 'FWD', 71], ['Kosta Barbarouses', 10, 'FWD', 71],
    ['Sarpreet Singh', 20, 'MID', 72],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP F
// ─────────────────────────────────────────────────────────────────────────────
const F: SquadTeam[] = [
  team('esp', 'Spain', '🇪🇸', ['#c60b1e', '#ffc400'], 'F', 5, [
    ['Unai Simón', 23, 'GK', 84], ['David Raya', 1, 'GK', 83],
    ['Robin Le Normand', 3, 'DEF', 82], ['Aymeric Laporte', 14, 'DEF', 82],
    ['Dani Carvajal', 2, 'DEF', 84], ['Marc Cucurella', 24, 'DEF', 81],
    ['Rodri', 16, 'MID', 90], ['Pedri', 9, 'MID', 86],
    ['Fabián Ruiz', 8, 'MID', 83], ['Dani Olmo', 10, 'MID', 84],
    ['Lamine Yamal', 19, 'FWD', 86], ['Nico Williams', 17, 'FWD', 84],
    ['Álvaro Morata', 7, 'FWD', 82], ['Mikel Oyarzabal', 21, 'FWD', 82],
    ['Ferran Torres', 11, 'FWD', 81],
  ]),
  team('tur', 'Turkey', '🇹🇷', ['#e30a17', '#ffffff'], 'F', 26, [
    ['Altay Bayındır', 23, 'GK', 76], ['Uğurcan Çakır', 1, 'GK', 79],
    ['Merih Demiral', 3, 'DEF', 78], ['Abdülkerim Bardakcı', 4, 'DEF', 76],
    ['Ferdi Kadıoğlu', 14, 'DEF', 78], ['Mert Müldür', 2, 'DEF', 76],
    ['Hakan Çalhanoğlu', 10, 'MID', 85], ['Orkun Kökçü', 18, 'MID', 79],
    ['İsmail Yüksek', 22, 'MID', 75], ['Arda Güler', 8, 'MID', 82],
    ['Kenan Yıldız', 21, 'FWD', 81], ['Kerem Aktürkoğlu', 7, 'FWD', 79],
    ['Barış Alper Yılmaz', 9, 'FWD', 77], ['Yusuf Yazıcı', 17, 'MID', 76],
    ['Cenk Tosun', 11, 'FWD', 74],
  ]),
  team('egy', 'Egypt', '🇪🇬', ['#ce1126', '#ffffff'], 'F', 35, [
    ['Mohamed El Shenawy', 1, 'GK', 75], ['Mohamed Abou Gabal', 23, 'GK', 72],
    ['Ahmed Hegazy', 6, 'DEF', 75], ['Mohamed Abdelmonem', 20, 'DEF', 74],
    ['Ahmed Fattouh', 13, 'DEF', 73], ['Omar Kamal', 2, 'DEF', 72],
    ['Mohamed Elneny', 17, 'MID', 76], ['Tarek Hamed', 8, 'MID', 74],
    ['Emam Ashour', 7, 'MID', 76], ['Mahmoud Trezeguet', 21, 'MID', 77],
    ['Mohamed Salah', 10, 'FWD', 88], ['Omar Marmoush', 9, 'FWD', 81],
    ['Mostafa Mohamed', 19, 'FWD', 76], ['Ahmed Sayed Zizo', 14, 'FWD', 75],
    ['Trezeguet', 11, 'FWD', 75],
  ]),
  team('aus', 'Australia', '🇦🇺', ['#ffcd00', '#00843d'], 'F', 24, [
    ['Mathew Ryan', 1, 'GK', 78], ['Joe Gauci', 18, 'GK', 72],
    ['Harry Souttar', 19, 'DEF', 77], ['Kye Rowles', 4, 'DEF', 74],
    ['Cameron Burgess', 5, 'DEF', 73], ['Aziz Behich', 16, 'DEF', 74],
    ['Aaron Mooy', 13, 'MID', 76], ['Jackson Irvine', 22, 'MID', 76],
    ['Connor Metcalfe', 8, 'MID', 73], ['Riley McGree', 17, 'MID', 74],
    ['Mathew Leckie', 7, 'FWD', 75], ['Jackson Irvine', 23, 'MID', 73],
    ['Mitchell Duke', 15, 'FWD', 73], ['Craig Goodwin', 11, 'FWD', 75],
    ['Kusini Yengi', 9, 'FWD', 73],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP G
// ─────────────────────────────────────────────────────────────────────────────
const G: SquadTeam[] = [
  team('por', 'Portugal', '🇵🇹', ['#006600', '#ff0000'], 'G', 6, [
    ['Diogo Costa', 22, 'GK', 84], ['Rui Patrício', 1, 'GK', 78],
    ['Rúben Dias', 3, 'DEF', 86], ['Pepe', 3, 'DEF', 79],
    ['João Cancelo', 20, 'DEF', 84], ['Nuno Mendes', 19, 'DEF', 83],
    ['Bruno Fernandes', 8, 'MID', 87], ['Vitinha', 16, 'MID', 84],
    ['Rúben Neves', 18, 'MID', 81], ['Bernardo Silva', 10, 'MID', 87],
    ['Cristiano Ronaldo', 7, 'FWD', 84], ['Rafael Leão', 15, 'FWD', 85],
    ['Gonçalo Ramos', 26, 'FWD', 81], ['João Félix', 11, 'FWD', 81],
    ['Pedro Neto', 17, 'FWD', 81],
  ]),
  team('nor', 'Norway', '🇳🇴', ['#ba0c2f', '#00205b'], 'G', 20, [
    ['Ørjan Nyland', 12, 'GK', 74], ['Egil Selvik', 1, 'GK', 71],
    ['Kristoffer Ajer', 4, 'DEF', 77], ['Leo Østigård', 5, 'DEF', 75],
    ['Julian Ryerson', 2, 'DEF', 76], ['David Møller Wolfe', 3, 'DEF', 73],
    ['Martin Ødegaard', 10, 'MID', 87], ['Sander Berge', 6, 'MID', 78],
    ['Patrick Berg', 8, 'MID', 74], ['Fredrik Aursnes', 15, 'MID', 77],
    ['Antonio Nusa', 7, 'FWD', 79], ['Erling Haaland', 9, 'FWD', 91],
    ['Alexander Sørloth', 11, 'FWD', 81], ['Oscar Bobb', 17, 'FWD', 77],
    ['Jørgen Strand Larsen', 19, 'FWD', 77],
  ]),
  team('civ', 'Ivory Coast', '🇨🇮', ['#ff8200', '#009639'], 'G', 34, [
    ['Yahia Fofana', 16, 'GK', 73], ['Badra Ali Sangaré', 1, 'GK', 71],
    ['Odilon Kossounou', 4, 'DEF', 77], ['Willy Boly', 22, 'DEF', 75],
    ['Ghislain Konan', 3, 'DEF', 73], ['Serge Aurier', 19, 'DEF', 74],
    ['Franck Kessié', 8, 'MID', 80], ['Seko Fofana', 5, 'MID', 78],
    ['Ibrahim Sangaré', 17, 'MID', 78], ['Jean Michaël Seri', 6, 'MID', 74],
    ['Simon Adingra', 11, 'FWD', 78], ['Sébastien Haller', 9, 'FWD', 78],
    ['Nicolas Pépé', 19, 'FWD', 77], ['Jonathan Bamba', 18, 'FWD', 75],
    ['Amad Diallo', 20, 'FWD', 79],
  ]),
  team('uzb', 'Uzbekistan', '🇺🇿', ['#1eb53a', '#0099b5'], 'G', 44, [
    ['Utkir Yusupov', 1, 'GK', 71], ['Abduvohid Nematov', 12, 'GK', 69],
    ['Abdukodir Khusanov', 4, 'DEF', 77], ['Rustamjon Ashurmatov', 3, 'DEF', 72],
    ['Sherzod Nasrullaev', 2, 'DEF', 71], ['Farrukh Sayfiev', 5, 'DEF', 71],
    ['Jaloliddin Masharipov', 7, 'MID', 74], ['Abbosbek Fayzullaev', 10, 'MID', 76],
    ['Otabek Shukurov', 6, 'MID', 72], ['Azizbek Turgunboev', 11, 'MID', 71],
    ['Eldor Shomurodov', 9, 'FWD', 77], ['Igor Sergeev', 17, 'FWD', 72],
    ['Oston Urunov', 18, 'FWD', 71], ['Jasurbek Jaloliddinov', 20, 'MID', 71],
    ['Khojimat Erkinov', 14, 'MID', 71],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP H
// ─────────────────────────────────────────────────────────────────────────────
const H: SquadTeam[] = [
  team('ned', 'Netherlands', '🇳🇱', ['#ff6200', '#ffffff'], 'H', 7, [
    ['Bart Verbruggen', 1, 'GK', 81], ['Mark Flekken', 12, 'GK', 78],
    ['Virgil van Dijk', 4, 'DEF', 87], ['Matthijs de Ligt', 3, 'DEF', 84],
    ['Nathan Aké', 5, 'DEF', 82], ['Denzel Dumfries', 22, 'DEF', 81],
    ['Frenkie de Jong', 21, 'MID', 86], ['Tijjani Reijnders', 14, 'MID', 82],
    ['Ryan Gravenberch', 8, 'MID', 82], ['Xavi Simons', 7, 'MID', 83],
    ['Cody Gakpo', 11, 'FWD', 84], ['Memphis Depay', 10, 'FWD', 82],
    ['Donyell Malen', 18, 'FWD', 79], ['Wout Weghorst', 19, 'FWD', 77],
    ['Brian Brobbey', 9, 'FWD', 78],
  ]),
  team('ecu', 'Ecuador', '🇪🇨', ['#ffd100', '#0033a0'], 'H', 23, [
    ['Hernán Galíndez', 1, 'GK', 74], ['Alexander Domínguez', 22, 'GK', 72],
    ['Piero Hincapié', 3, 'DEF', 81], ['Willian Pacho', 5, 'DEF', 81],
    ['Félix Torres', 2, 'DEF', 76], ['Pervis Estupiñán', 7, 'DEF', 80],
    ['Moisés Caicedo', 23, 'MID', 84], ['Alan Franco', 13, 'MID', 75],
    ['Carlos Gruezo', 20, 'MID', 74], ['Jhegson Méndez', 6, 'MID', 74],
    ['Kendry Páez', 19, 'MID', 76], ['Enner Valencia', 13, 'FWD', 77],
    ['Gonzalo Plata', 10, 'FWD', 77], ['Kevin Rodríguez', 9, 'FWD', 74],
    ['Jeremy Sarmiento', 11, 'FWD', 74],
  ]),
  team('tun', 'Tunisia', '🇹🇳', ['#e70013', '#ffffff'], 'H', 38, [
    ['Aymen Dahmen', 16, 'GK', 73], ['Béchir Ben Saïd', 1, 'GK', 72],
    ['Montassar Talbi', 3, 'DEF', 75], ['Yassine Meriah', 2, 'DEF', 73],
    ['Ali Abdi', 12, 'DEF', 73], ['Wajdi Kechrida', 21, 'DEF', 72],
    ['Aïssa Laïdouni', 14, 'MID', 77], ['Ellyes Skhiri', 8, 'MID', 78],
    ['Ferjani Sassi', 6, 'MID', 73], ['Hannibal Mejbri', 13, 'MID', 75],
    ['Naïm Sliti', 10, 'FWD', 75], ['Youssef Msakni', 7, 'FWD', 74],
    ['Wahbi Khazri', 9, 'FWD', 74], ['Seifeddine Jaziri', 19, 'FWD', 73],
    ['Elias Achouri', 11, 'FWD', 74],
  ]),
  team('can', 'Canada', '🇨🇦', ['#ff0000', '#ffffff'], 'H', 16, [
    ['Maxime Crépeau', 16, 'GK', 75], ['Dayne St. Clair', 1, 'GK', 74],
    ['Alphonso Davies', 19, 'DEF', 84], ['Moïse Bombito', 4, 'DEF', 76],
    ['Derek Cornelius', 13, 'DEF', 74], ['Alistair Johnston', 2, 'DEF', 77],
    ['Stephen Eustáquio', 7, 'MID', 78], ['Ismaël Koné', 6, 'MID', 76],
    ['Jonathan Osorio', 21, 'MID', 75], ['Tajon Buchanan', 11, 'MID', 78],
    ['Jonathan David', 20, 'FWD', 83], ['Cyle Larin', 17, 'FWD', 77],
    ['Liam Millar', 18, 'FWD', 73], ['Jacob Shaffelburg', 14, 'FWD', 74],
    ['Promise David', 9, 'FWD', 74],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP I
// ─────────────────────────────────────────────────────────────────────────────
const I: SquadTeam[] = [
  team('ger', 'Germany', '🇩🇪', ['#000000', '#dd0000'], 'I', 8, [
    ['Marc-André ter Stegen', 1, 'GK', 86], ['Oliver Baumann', 12, 'GK', 76],
    ['Antonio Rüdiger', 2, 'DEF', 85], ['Jonathan Tah', 4, 'DEF', 82],
    ['Joshua Kimmich', 6, 'DEF', 86], ['Maximilian Mittelstädt', 18, 'DEF', 78],
    ['Toni Kroos', 8, 'MID', 86], ['İlkay Gündoğan', 21, 'MID', 84],
    ['Robert Andrich', 23, 'MID', 78], ['Florian Wirtz', 17, 'MID', 87],
    ['Jamal Musiala', 10, 'MID', 87], ['Kai Havertz', 7, 'FWD', 84],
    ['Niclas Füllkrug', 9, 'FWD', 80], ['Leroy Sané', 19, 'FWD', 83],
    ['Serge Gnabry', 20, 'FWD', 82],
  ]),
  team('den', 'Denmark', '🇩🇰', ['#c60c30', '#ffffff'], 'I', 21, [
    ['Kasper Schmeichel', 1, 'GK', 80], ['Frederik Rønnow', 16, 'GK', 75],
    ['Andreas Christensen', 6, 'DEF', 82], ['Joachim Andersen', 4, 'DEF', 80],
    ['Jannik Vestergaard', 3, 'DEF', 77], ['Joakim Mæhle', 5, 'DEF', 77],
    ['Pierre-Emile Højbjerg', 23, 'MID', 82], ['Morten Hjulmand', 8, 'MID', 78],
    ['Christian Eriksen', 10, 'MID', 82], ['Mikkel Damsgaard', 14, 'MID', 78],
    ['Rasmus Højlund', 9, 'FWD', 81], ['Jonas Wind', 19, 'FWD', 78],
    ['Andreas Skov Olsen', 11, 'FWD', 78], ['Christian Nørgaard', 13, 'MID', 76],
    ['Gustav Isaksen', 20, 'FWD', 76],
  ]),
  team('alg', 'Algeria', '🇩🇿', ['#006233', '#ffffff'], 'I', 37, [
    ['Anthony Mandrea', 1, 'GK', 73], ['Alexandre Oukidja', 16, 'GK', 72],
    ['Aïssa Mandi', 4, 'DEF', 76], ['Ramy Bensebaini', 5, 'DEF', 78],
    ['Youcef Atal', 2, 'DEF', 75], ['Mohamed Amine Tougai', 3, 'DEF', 73],
    ['Ismaël Bennacer', 8, 'MID', 80], ['Houssem Aouar', 11, 'MID', 78],
    ['Nabil Bentaleb', 6, 'MID', 74], ['Ramiz Zerrouki', 13, 'MID', 74],
    ['Riyad Mahrez', 7, 'FWD', 83], ['Saïd Benrahma', 10, 'FWD', 78],
    ['Amine Gouiri', 9, 'FWD', 78], ['Baghdad Bounedjah', 17, 'FWD', 75],
    ['Yassine Benzia', 18, 'FWD', 73],
  ]),
  team('ksa', 'Saudi Arabia', '🇸🇦', ['#006c35', '#ffffff'], 'I', 41, [
    ['Mohammed Al-Owais', 21, 'GK', 73], ['Nawaf Al-Aqidi', 1, 'GK', 70],
    ['Ali Al-Bulayhi', 5, 'DEF', 73], ['Hassan Tambakti', 3, 'DEF', 72],
    ['Saud Abdulhamid', 2, 'DEF', 73], ['Sultan Al-Ghannam', 13, 'DEF', 72],
    ['Mohamed Kanno', 28, 'MID', 73], ['Nasser Al-Dawsari', 16, 'MID', 73],
    ['Salem Al-Dawsari', 10, 'MID', 78], ['Abdulrahman Ghareeb', 11, 'MID', 73],
    ['Sami Al-Najei', 23, 'MID', 72], ['Firas Al-Buraikan', 9, 'FWD', 75],
    ['Saleh Al-Shehri', 20, 'FWD', 73], ['Abdullah Radif', 18, 'FWD', 72],
    ['Musab Al-Juwayr', 7, 'MID', 72],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP J
// ─────────────────────────────────────────────────────────────────────────────
const J: SquadTeam[] = [
  team('bel', 'Belgium', '🇧🇪', ['#e30613', '#ffd700'], 'J', 10, [
    ['Thibaut Courtois', 1, 'GK', 88], ['Koen Casteels', 12, 'GK', 79],
    ['Wout Faes', 4, 'DEF', 78], ['Zeno Debast', 3, 'DEF', 77],
    ['Timothy Castagne', 21, 'DEF', 79], ['Arthur Theate', 5, 'DEF', 77],
    ['Kevin De Bruyne', 7, 'MID', 88], ['Youri Tielemans', 8, 'MID', 82],
    ['Amadou Onana', 20, 'MID', 81], ['Charles De Ketelaere', 6, 'MID', 80],
    ['Jérémy Doku', 22, 'FWD', 82], ['Romelu Lukaku', 9, 'FWD', 84],
    ['Leandro Trossard', 17, 'FWD', 81], ['Dodi Lukebakio', 11, 'FWD', 78],
    ['Johan Bakayoko', 19, 'FWD', 78],
  ]),
  team('col', 'Colombia', '🇨🇴', ['#fcd116', '#003893'], 'J', 13, [
    ['Camilo Vargas', 1, 'GK', 76], ['David Ospina', 12, 'GK', 75],
    ['Dávinson Sánchez', 23, 'DEF', 80], ['Yerry Mina', 13, 'DEF', 77],
    ['Daniel Muñoz', 4, 'DEF', 79], ['Johan Mojica', 17, 'DEF', 76],
    ['Richard Ríos', 15, 'MID', 79], ['Jefferson Lerma', 16, 'MID', 78],
    ['James Rodríguez', 10, 'MID', 81], ['Jhon Arias', 7, 'MID', 79],
    ['Luis Díaz', 11, 'FWD', 85], ['Jhon Durán', 9, 'FWD', 80],
    ['Rafael Santos Borré', 19, 'FWD', 76], ['Luis Sinisterra', 22, 'FWD', 78],
    ['Jorge Carrascal', 8, 'MID', 76],
  ]),
  team('mar', 'Morocco', '🇲🇦', ['#c1272d', '#006233'], 'J', 12, [
    ['Yassine Bounou', 1, 'GK', 83], ['Munir Mohamedi', 12, 'GK', 74],
    ['Achraf Hakimi', 2, 'DEF', 85], ['Noussair Mazraoui', 3, 'DEF', 81],
    ['Nayef Aguerd', 5, 'DEF', 80], ['Romain Saïss', 6, 'DEF', 77],
    ['Sofyan Amrabat', 4, 'MID', 80], ['Azzedine Ounahi', 8, 'MID', 79],
    ['Bilal El Khannouss', 7, 'MID', 78], ['Brahim Díaz', 19, 'MID', 82],
    ['Hakim Ziyech', 7, 'FWD', 80], ['Youssef En-Nesyri', 19, 'FWD', 80],
    ['Sofiane Boufal', 17, 'FWD', 78], ['Eliesse Ben Seghir', 21, 'FWD', 78],
    ['Ayoub El Kaabi', 9, 'FWD', 78],
  ]),
  team('qat', 'Qatar', '🇶🇦', ['#8a1538', '#ffffff'], 'J', 43, [
    ['Meshaal Barsham', 22, 'GK', 72], ['Saad Al-Sheeb', 1, 'GK', 71],
    ['Boualem Khoukhi', 16, 'DEF', 72], ['Tarek Salman', 15, 'DEF', 72],
    ['Bassam Al-Rawi', 3, 'DEF', 72], ['Pedro Miguel', 13, 'DEF', 72],
    ['Karim Boudiaf', 14, 'MID', 72], ['Hassan Al-Haydos', 10, 'MID', 74],
    ['Abdulaziz Hatem', 23, 'MID', 72], ['Akram Afif', 11, 'MID', 78],
    ['Almoez Ali', 19, 'FWD', 76], ['Mohammed Muntari', 9, 'FWD', 72],
    ['Ahmed Alaaeldin', 17, 'FWD', 71], ['Yusuf Abdurisag', 7, 'FWD', 71],
    ['Ismaeel Mohammad', 18, 'MID', 71],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP K
// ─────────────────────────────────────────────────────────────────────────────
const K: SquadTeam[] = [
  team('usa', 'United States', '🇺🇸', ['#002868', '#bf0a30'], 'K', 15, [
    ['Matt Turner', 1, 'GK', 78], ['Patrick Schulte', 12, 'GK', 73],
    ['Sergiño Dest', 2, 'DEF', 79], ['Chris Richards', 3, 'DEF', 78],
    ['Antonee Robinson', 5, 'DEF', 80], ['Tim Ream', 13, 'DEF', 75],
    ['Tyler Adams', 4, 'MID', 79], ['Weston McKennie', 8, 'MID', 81],
    ['Yunus Musah', 6, 'MID', 78], ['Gio Reyna', 7, 'MID', 78],
    ['Christian Pulisic', 10, 'FWD', 84], ['Folarin Balogun', 9, 'FWD', 79],
    ['Tim Weah', 21, 'FWD', 77], ['Ricardo Pepi', 16, 'FWD', 77],
    ['Malik Tillman', 11, 'MID', 78],
  ]),
  team('ita', 'Italy', '🇮🇹', ['#0066cc', '#ffffff'], 'K', 27, [
    ['Gianluigi Donnarumma', 21, 'GK', 87], ['Guglielmo Vicario', 1, 'GK', 81],
    ['Alessandro Bastoni', 23, 'DEF', 84], ['Giovanni Di Lorenzo', 2, 'DEF', 81],
    ['Riccardo Calafiori', 5, 'DEF', 80], ['Federico Dimarco', 3, 'DEF', 82],
    ['Nicolò Barella', 18, 'MID', 85], ['Jorginho', 8, 'MID', 80],
    ['Davide Frattesi', 16, 'MID', 79], ['Sandro Tonali', 4, 'MID', 82],
    ['Federico Chiesa', 14, 'FWD', 82], ['Gianluca Scamacca', 9, 'FWD', 79],
    ['Mateo Retegui', 22, 'FWD', 79], ['Giacomo Raspadori', 18, 'FWD', 78],
    ['Moise Kean', 19, 'FWD', 79],
  ]),
  team('cmr', 'Cameroon', '🇨🇲', ['#007a5e', '#ce1126'], 'K', 39, [
    ['André Onana', 24, 'GK', 82], ['Devis Epassy', 16, 'GK', 71],
    ['Christopher Wooh', 5, 'DEF', 75], ['Jean-Charles Castelletto', 3, 'DEF', 74],
    ['Nouhou Tolo', 12, 'DEF', 73], ['Enzo Tchato', 2, 'DEF', 72],
    ['André-Frank Zambo Anguissa', 8, 'MID', 82], ['Carlos Baleba', 4, 'MID', 78],
    ['Martin Hongla', 17, 'MID', 73], ['Olivier Ntcham', 18, 'MID', 73],
    ['Bryan Mbeumo', 19, 'FWD', 81], ['Vincent Aboubakar', 10, 'FWD', 76],
    ['Karl Toko Ekambi', 9, 'FWD', 75], ['Georges-Kévin Nkoudou', 7, 'FWD', 73],
    ['Frank Magri', 11, 'FWD', 73],
  ]),
  team('hai', 'Haiti', '🇭🇹', ['#00209f', '#d21034'], 'K', 47, [
    ['Johny Placide', 16, 'GK', 70], ['Josué Duverger', 1, 'GK', 68],
    ['Ricardo Adé', 4, 'DEF', 71], ['Carlens Arcus', 2, 'DEF', 71],
    ['Andrew Jean-Baptiste', 5, 'DEF', 70], ['Garvens Metelus', 3, 'DEF', 70],
    ['Danley Jean Jacques', 8, 'MID', 73], ['Jean-Kévin Augustin', 10, 'MID', 71],
    ['Carl Sainté', 6, 'MID', 70], ['Leverton Pierre', 14, 'MID', 69],
    ['Frantzdy Pierrot', 9, 'FWD', 73], ['Duckens Nazon', 11, 'FWD', 71],
    ['Don Deedson Louicius', 7, 'FWD', 70], ['Ruben Providence', 19, 'FWD', 71],
    ['Jean Ricner Bellegarde', 20, 'MID', 76],
  ]),
]

// ─────────────────────────────────────────────────────────────────────────────
//  GROUP L
// ─────────────────────────────────────────────────────────────────────────────
const L: SquadTeam[] = [
  team('swe', 'Sweden', '🇸🇪', ['#006aa7', '#fecc00'], 'L', 29, [
    ['Robin Olsen', 1, 'GK', 76], ['Kristoffer Nordfeldt', 12, 'GK', 73],
    ['Victor Lindelöf', 3, 'DEF', 79], ['Isak Hien', 4, 'DEF', 78],
    ['Gabriel Gudmundsson', 5, 'DEF', 75], ['Emil Krafth', 2, 'DEF', 73],
    ['Lukas Bergvall', 8, 'MID', 76], ['Hjalmar Ekdal', 6, 'MID', 73],
    ['Yasin Ayari', 15, 'MID', 74], ['Anthony Elanga', 11, 'FWD', 80],
    ['Alexander Isak', 9, 'FWD', 86], ['Viktor Gyökeres', 10, 'FWD', 85],
    ['Dejan Kulusevski', 7, 'FWD', 83], ['Emil Forsberg', 10, 'MID', 78],
    ['Jesper Karlström', 14, 'MID', 73],
  ]),
  team('per', 'Peru', '🇵🇪', ['#d91023', '#ffffff'], 'L', 31, [
    ['Pedro Gallese', 1, 'GK', 75], ['Carlos Cáceda', 12, 'GK', 71],
    ['Luis Abram', 3, 'DEF', 74], ['Carlos Zambrano', 5, 'DEF', 73],
    ['Marcos López', 17, 'DEF', 74], ['Luis Advíncula', 17, 'DEF', 74],
    ['Renato Tapia', 13, 'MID', 76], ['Sergio Peña', 8, 'MID', 74],
    ['Yoshimar Yotún', 19, 'MID', 73], ['Christian Cueva', 10, 'MID', 74],
    ['André Carrillo', 18, 'FWD', 75], ['Gianluca Lapadula', 9, 'FWD', 75],
    ['Paolo Guerrero', 9, 'FWD', 73], ['Edison Flores', 20, 'FWD', 73],
    ['Andy Polo', 22, 'FWD', 71],
  ]),
  team('par', 'Paraguay', '🇵🇾', ['#d52b1e', '#0038a8'], 'L', 46, [
    ['Roberto Fernández', 1, 'GK', 73], ['Carlos Coronel', 23, 'GK', 73],
    ['Gustavo Gómez', 2, 'DEF', 78], ['Fabián Balbuena', 5, 'DEF', 74],
    ['Omar Alderete', 3, 'DEF', 76], ['Junior Alonso', 6, 'DEF', 74],
    ['Andrés Cubas', 13, 'MID', 75], ['Mathías Villasanti', 8, 'MID', 74],
    ['Damián Bobadilla', 16, 'MID', 73], ['Diego Gómez', 11, 'MID', 76],
    ['Miguel Almirón', 10, 'FWD', 78], ['Julio Enciso', 9, 'FWD', 78],
    ['Antonio Sanabria', 19, 'FWD', 75], ['Ramón Sosa', 7, 'FWD', 75],
    ['Adam Bareiro', 21, 'FWD', 73],
  ]),
  team('jam', 'Jamaica', '🇯🇲', ['#009b3a', '#fed100'], 'L', 48, [
    ['Andre Blake', 1, 'GK', 75], ['Jahmali Waite', 23, 'GK', 70],
    ['Damion Lowe', 5, 'DEF', 72], ['Ethan Pinnock', 6, 'DEF', 75],
    ['Di\'Shon Bernard', 4, 'DEF', 73], ['Greg Leigh', 3, 'DEF', 72],
    ['Bobby De Cordova-Reid', 14, 'MID', 76], ['Kasey Palmer', 8, 'MID', 73],
    ['Joel Latibeaudiere', 2, 'MID', 73], ['Demarai Gray', 11, 'MID', 78],
    ['Michail Antonio', 9, 'FWD', 76], ['Leon Bailey', 7, 'FWD', 81],
    ['Shamar Nicholson', 19, 'FWD', 74], ['Renaldo Cephas', 17, 'FWD', 72],
    ['Kaheim Dixon', 20, 'FWD', 71],
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
