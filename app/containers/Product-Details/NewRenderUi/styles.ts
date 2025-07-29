import { colors } from '~/constants/colors';

const styles = {
  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '20px'
  },
  activeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: colors.PRIMARY
  },
  inactiveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: colors.LIGHT_SILVER
  },
  customDotsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left : '50%',
    transform: "translateX(-50%)",
    bottom: "23px",
    zIndex:'100'
  },
  customDot: {
    width: '6px',
    height: '6px',
    borderRadius: '5px',
    backgroundColor: colors.EERIE_BLACK,
    margin: '0 5px',
    border : `0.4px solid ${colors.WHITE}`,
    zIndex:'100'
  },
  activeCustomDot: {
    backgroundColor: colors.EERIE_BLACK,
    width: '14px',
    height: '6px',
  },
  mt: {
    marginTop: '3px'
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  bottomSheetRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: '8rem'
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '56px 0 20px 0',
    height: '100%'
  },
  pdpcontentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 0 20px 0',

  },
  bottomSheetContentWrapper: {
    display: "flex",
    flexDirection: "column",
    paddingTop: '61px',
    textAlign: 'left'
  },
  pdpbottomSheetContentWrapper: {
    display: "flex",
    flexDirection: "column",
    paddingTop: '61px',
    textAlign: 'left'
  },
  productImage: {
    paddingLeft: '50px'
  },
  productTitle: {
    paddingTop: '24px',
    paddingLeft: '16px',
    fontWeight: 400,
    fontSize: '16px',
    color: colors.DIM_GRAY
  },
  productPrice: {
    paddingTop: '16px',
    paddingLeft: '16px',
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'end'
  },
  productNewPrice: {
    fontWeight: 500,
    fontSize: '18px',
    color: colors.PRIMARY,
    lineHeight: '24px'
  },
  productOldPrice: {
    fontWeight: 400,
    fontSize: '14px',
    color: colors.DIM_GRAY,
    lineHeight: '20px',
    textDecoration: 'line-through'
  },
  productDiscount: {
    fontWeight: 500,
    fontSize: '14px',
    color: colors.GREEN_CYAN,
    lineHeight: '20px'
  },
  simpleInstallments: {
    paddingTop: '12px',
    paddingLeft: '16px'
  },
  divider: {
    height: "4px",
    width: "100%",
    backgroundColor: colors.LIGHT_GRAY,
    border: "none",
    margin: 0
  },
  viewAll: {
    paddingTop: '20px',
    paddingLeft: '16px',
    paddingRight: '22px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: 500,
    color: colors.PRIMARY_DARK,
    textTransform: 'none',
    cursor: 'pointer',
    '&:hover': { backgroundColor: colors.WHITE }
  },
  sizeGuideButtonWrapper: {
    backgroundColor: colors.PRIMARY_LIGHTER,
    padding: '9px',
    margin: '0px 16px 24px 16px',
    display: 'flex',
    borderRadius: '8px',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    alignItems: 'center',
    '&:hover': { backgroundColor: colors.PRIMARY_LIGHTER }
  },
  toast: {
    padding: '10px 16px',
    fontWeight: 500,
    fontSize: '12px',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '100px'
  },
  imageStyle: {
    width: '100%'
  },
  linkStyle: {
    pointerEvents: 'none'
  },
  emptyLinkStyle: {},
  modelInfoContainer: {
    display: 'flex',
    flexDirection: 'column' as any,
    gap: 16,
    padding : '10px'
  },
  modelTitle: {
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '20px',
    color: colors.BLACK
  },
  modelBody: {
    display: 'flex',
    flexDirection: 'row' as any,
    alignItems: 'start',
    gap: 16
  },
  modelImage: {
    maxWidth: '16.33%',
    aspectRatio: 1,
    objectFit: 'cover' as any,
    borderRadius: '5px',
    flexShrink: 0
  },
  modelDataBody: {
    display: 'flex',
    flexWrap: 'wrap' as any,
    alignItems: 'center'
  },
  modelDataContainer: {
    display: 'inline-block',
    width: '50%',
  },
  modelData: {
    display: 'inline-block',
    boxSizing: 'border-box' as any,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    color: colors.BLACK,
    padding: '2px 4px',
    backgroundColor: '#F2F3F6'
  },
  tickerPill: {
    position: 'absolute',
    bottom: '32px',
    left: '8px',
    borderRadius: '23px',
    height: '25px',
    backgroundColor: colors.WHITE,
    color: 'black',
    fontWeight: 500,
    fontSize: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // gap: '5px',
    padding: '2px 0 2px 2px',
    opacity: '.75',
    cursor: 'pointer',
    border: '0.5px solid #31B375',
    boxSizing: 'border-box'
  },
  userIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GREEN_CYAN,
    width: '20px',
    height: '20px',
    borderRadius: '20px'
  },
  tickerText: {
    marginRight: '8px',
    marginLeft: '5px',
    animationName: '$fade',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationDelay: '1s'
  },
  '@keyframes fade': {
    '0%': {opacity: '0'},
    '100%': {opacity: '1'},
  },
  productTag: {
    position: 'absolute',
    top: '18px',
    left: '0',
    padding: '2px 8px 2px 6px',
    color: "#FFF",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "18px",
    backgroundColor: colors.PRIMARY_DARK,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 5px 5px 0',
    outline: '1px solid #ffffff80'
  }
};

export default styles;