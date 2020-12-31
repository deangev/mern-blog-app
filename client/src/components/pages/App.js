// import React from 'react'
// import ReactCrop, { makeAspectCrop } from 'react-image-crop'
// import 'react-image-crop/dist/ReactCrop.css'

// export default class App extends React.Component {
//     state = {
//       src: null,
//       crop: {
//         x: 0,
//         y: 0,
//         width: 20,
//         height: 80
//       },
//     }
  
//     onSelectFile = e => {
//       if (e.target.files && e.target.files.length > 0) {
//         const reader = new FileReader()
//         reader.addEventListener(
//           'load',
//           () =>
//             this.setState({
//               src: reader.result,
//             }),
//           false
//         )
//         reader.readAsDataURL(e.target.files[0])
//       }
//     }
  
//     onImageLoaded = image => {
//       console.log('onCropComplete', image)
//     }
  
//     onCropComplete = crop => {
//       console.log('onCropComplete', crop)
//     }
  
//     onCropChange = crop => {
//       this.setState({ crop })
//     }
  
//     render() {
//       return (
//         <div className="App" style={{position: 'absolute', top: '10rem'}}>
//           <div>
//             <input type="file" onChange={this.onSelectFile} />
//           </div>
//           {this.state.src && (
//             <ReactCrop
//               src={this.state.src}
//               crop={this.state.crop}
//               onImageLoaded={this.onImageLoaded}
//               onComplete={this.onCropComplete}
//               onChange={this.onCropChange}
//             />
//           )}
//         </div>
//       )
//     }
//   }
  

