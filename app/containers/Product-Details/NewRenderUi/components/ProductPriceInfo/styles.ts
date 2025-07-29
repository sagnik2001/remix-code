import { colors } from '~/constants/colors';

const styles = {
  containerWishlist: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: '16px',
    width:'100%',
    position : 'relative',
  },
  productTitle: {
    fontWeight: 500,
    fontSize: '13px',
    color: "#6A6A6A",
    width: '90%',
    margin: 0,
  },
  bottomSheetpProductTitle: {
    fontWeight: 400,
    fontSize: '16px',
    color: colors.DIM_GRAY,
    margin: 0,
  },
  productPrice: {
    paddingTop: '4px',
    paddingLeft: '16px',
    display: 'flex',
    flexDirection: 'row',
    gap: '6px',
    alignItems: 'center'
  },
  productNewPrice: {
    fontWeight: 700,
    fontSize: '16px',
    color: "#1A1A1A",
    lineHeight: '22px'
  },
  productOldPrice: {
    fontWeight: 400,
    fontSize: '14px',
    color: "#6A6A6A",
    lineHeight: '20px'
  },
  productDiscount: {
    fontWeight: 500,
    fontSize: '14px',
    color: colors.GREEN_CYAN,
    lineHeight: '20px'
  },
  simpleInstallments: {
    padding: '12px 16px'
  },
  divider: {
    marginTop: '24px',
    marginBottom: '24px',
    height: '4px',
    backgroundColor: colors.LIGHT_GRAY,
    borderColor: colors.LIGHT_GRAY
  },
  visibleProductSku: {
    paddingLeft: '16px',
    paddingTop: '8px',
    fontWeight: 200,
    fontSize: '12px',
    color: colors.DIM_GRAY,
    width: '80%'
  },
  hiddenProductSku: {
    paddingLeft: '16px',
    paddingTop: '8px',
    fontWeight: 200,
    fontSize: '12px',
    color: colors.DIM_GRAY,
    width: '80%',
    display: 'none'
  },
  flex: {
    display: 'flex',
  },
  offerTag: {
    display: 'flex',
    alignItems: 'center',
    // backgroundColor: '#31B275',
    color: "#C85400",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "16px",
 
  },
  offerTagRibbon: {
    borderTop: '9px solid #31B27599',
    borderLeft: '2.5px solid #31B275',
    borderBottom: '9px solid #31B27599',
    borderRight: '2.5px solid white',
    marginRight: '3px'
  }
};

export default styles;
