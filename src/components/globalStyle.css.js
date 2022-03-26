import {createGlobalStyle} from "styled-components";
import styled from "styled-components";
import "../assets/fonts/stylesheet.css";

export const Container = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    height: 70vh;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
`
export const GlobalStyle = createGlobalStyle`

    :root {
    --primary: #9FD948;
    --secundary: #6F8C43;
    --tertiary: #4A4D26;
    --font-dark: #4A4D26;
    --font-soft: #ffffff;
    }

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    
    body {
        font-family: 'Raleway', sans-serif;
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    select {
          height: fit-content;
    }
`;