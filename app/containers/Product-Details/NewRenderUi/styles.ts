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
};

export default styles;