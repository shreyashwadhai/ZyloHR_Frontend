



// import React from 'react';
// import styled from 'styled-components';

// const Loader = () => {
//   return (
//     <Wrapper>
//       <Spinner>
//         <Circle />
//         <Circle delay="0.2s" />
//         <Circle delay="0.4s" />
//       </Spinner>
//     </Wrapper>
//   );
// };

// export default Loader;

// // Styled Components
// const Wrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   min-height: 100vh;
//   background: transparent;
// `;

// const Spinner = styled.div`
//   position: relative;
//   width: 80px;
//   height: 80px;
//   animation: rotate 2s linear infinite;
// `;

// const Circle = styled.div`
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   border: 4px solid transparent;
//   border-top-color: #FF6B6B;
//   border-radius: 50%;
//   animation: spin 1s ease-in-out infinite;
//   animation-delay: ${(props) => props.delay || "0s"};

//   &:nth-child(2) {
//     border-top-color: #FFD93D;
//     transform: scale(0.85);
//   }

//   &:nth-child(3) {
//     border-top-color: #6BCB77;
//     transform: scale(0.7);
//   }

//   @keyframes spin {
//     0% {
//       transform: rotate(0deg) scale(1);
//     }
//     50% {
//       transform: rotate(180deg) scale(0.95);
//     }
//     100% {
//       transform: rotate(360deg) scale(1);
//     }
//   }

//   @keyframes rotate {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
// `;


import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 48px;
    height: 48px;
    margin: 16rem auto;
    position: relative;
  }

  .loader:before {
    content: '';
    width: 48px;
    height: 5px;
    background: #999;
    position: absolute;
    top: 60px;
    left: 0;
    border-radius: 50%;
    animation: shadow324 0.5s linear infinite;
  }

  .loader:after {
    content: '';
    width: 100%;
    height: 100%;
    background: rgb(61, 106, 255);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    animation: jump7456 0.5s linear infinite;
  }

  @keyframes jump7456 {
    15% {
      border-bottom-right-radius: 3px;
    }

    25% {
      transform: translateY(9px) rotate(22.5deg);
    }

    50% {
      transform: translateY(18px) scale(1, .9) rotate(45deg);
      border-bottom-right-radius: 40px;
    }

    75% {
      transform: translateY(9px) rotate(67.5deg);
    }

    100% {
      transform: translateY(0) rotate(90deg);
    }
  }

  @keyframes shadow324 {

    0%,
      100% {
      transform: scale(1, 1);
    }

    50% {
      transform: scale(1.2, 1);
    }
  }`;

export default Loader;
