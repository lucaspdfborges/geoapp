// Rectangle legends
const rectColors = ["hsla(0, 20%, 50%,0.4)","hsla(120, 20%, 50%,0.4)","hsla(240, 20%, 50%,0.4)"];

const rectColorsText = ["hsla(0, 20%, 20%, 1)","hsla(120, 20%, 20%, 1)","hsla(240, 20%, 20%, 1)"];

const rectText = ["COLETIVO","INDIVIDUAL"];
const baseScale = 10;
const maxZoom = 7;
const listColors = [["hsla(340, 35%, 55%, 0.95)", "hsla(380, 35%, 55%, 0.95)"],["hsla(220, 30%, 60%, 0.95)", "hsla(170, 30%, 60%, 0.95)"],["hsla(230, 35%, 55%, 0.95)", "hsla(310, 35%, 55%, 0.95)"],["#FFF", "#DDD"]]

// Paths for json files
const areaVerdeURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/area_verde.json";
const manchaUrbanaURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/mancha.json";
const eixosViariosURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/eixo.json";
const zonasURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/mczona.json";
const lagosURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/lagos.json";
const origemOdURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/originOD.json";
const destinoOdURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/destinyOD.json";
const nomeIdZonaCenterURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/NOME_ID_MCZ_CENTER_name_sorted.json";
const flowOdURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/flow_od.json";
const zonaOdURL =  "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/mz_array_do.json";
const zonaArrayURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/mz_array.json";
const macrozonaOdURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/macrozona_od.json";
const idRaURL = "https://raw.githubusercontent.com/lucaspdfborges/geojson/master/support/ID_RA.json";

const mapCenter = [-47.797089, -15.77526];
const mapBbox =  [ -48.285791, -16.050265, -47.308387, -15.500255 ];
const mapWidth = mapBbox[2] - mapBbox[0];
const mapHeight = mapBbox[3] - mapBbox[1];


const offsetL =  5;
const offsetT =  5;
