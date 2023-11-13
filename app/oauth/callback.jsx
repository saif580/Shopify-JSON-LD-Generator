
// import { useParams } from 'react-router-dom';

// // Assuming your OAuth callback route is '/oauth/callback'
// const OAuthCallback = () => {
//     const { code } = useParams();
  
//     // Exchange the authorization code for an access token
//     shopify.exchange_temporary_token(code, (err, data) => {
//       if (err) {
//         console.error('Error exchanging temporary token:', err);
//         // Handle errors as needed
//       } else {
//         const accessToken = data.access_token;
//         console.log('Shopify Access Token:', accessToken);
//         // Add your logic to save or use the access token as needed
//       }
//     });
  
//     return <div>Processing...</div>;
//   };
  
//   export default OAuthCallback;
  