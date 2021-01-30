import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#203040",
    },
    secondary: {
      main: "#abc",
    },
  },
});

export default theme;
