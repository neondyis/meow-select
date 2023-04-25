import {defineStyle, extendTheme} from "@chakra-ui/react"
import { mode, StyleFunctionProps} from "@chakra-ui/theme-tools"


export const homeBackground = defineStyle({
    opacity: 0.8,
    background: 'radial-gradient(circle, transparent 20%, #8FA3EC 20%, #8FA3EC 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #8FA3EC 20%, #8FA3EC 80%, transparent 80%, transparent) 25px 25px, linear-gradient(#7282BD 2px, transparent 2px) 0 -1px, linear-gradient(90deg, #7282BD 2px, #8FA3EC 2px) -1px 0',
    backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px'
})


const styles = {
    global: (props: Record<string, any> | StyleFunctionProps) => ({
        body: {
            ...homeBackground,
            fontFamily: "body",
            color: props.colorMode === "white" ? "gray.800" : "dark",
        },
        "html, body, main, main > div": {
            height: "100vh",
        }
    }),
}

const components = {
    Heading: {
        variants: {
            'section-title': {
                textDecoration: 'underline',
                fontSize: 30,
                fontFamily: 'body',
                color: 'whiteAlpha.900',
                textUnderlineOffset: 6,
                textDecorationColor: "#42518B",
                textDecorationThickness: 4,
                marginTop: 3,
                marginBottom: 4,
            },
        },
    },
    Link: {
        baseStyle: (props: Record<string, any> | StyleFunctionProps) => ({
            color: mode("#3d7aed", "#ff63c3")(props),
            textUnderlineOffset: 3,
        }),
    },
}

const fonts = {
    heading: "'M PLUS Rounded 1c'",
    body: "'Open Sans', sans-serif",
}

const colors = {
    primary: {
        100: "#cb8c92",
        200: "#b0788f",
        300: "#95658b",
        400: "#7a5188",
        500: "#5f3d84",
        600: "#442980",
    },
    secondary: "#1b283d",
    pumice: "#c5cdc6",
    gray: "#5f6775",
    nandor: "#555e57",
    jumbo: "#818186",
    juan: "#2f536e",
    grassTeal: "#88ccca",
    blue: "#addce9",
    wedgewood: "#52809d",
    astronaut: "#2e4374",
    text: "#000",
}

const config = {
    initialColorMode: "dark",
    useSystemColorMode: true,
}

const theme = extendTheme({ config, styles, components, fonts, colors })
export default theme