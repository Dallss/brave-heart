// add fonts here

const fonts = ['Fjalla One', 'Roboto', 'Open Sans', 'Montserrat']

const fontQuery = fonts.map((font) => `family=${font.replace(/ /g, '+')}`).join('&')

const googleFontsURL = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`

export default googleFontsURL
