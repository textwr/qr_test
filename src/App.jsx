import jsQR from "jsqr";
import { useEffect, useState, useRef } from "react";
import { IoIosMenu } from "react-icons/io";
import { toast } from "react-toastify";

function App() {
  const [userLocation, setUserLocations] = useState({});
  const [videoStream, setVideoStream] = useState({});
  const [permissionGranted, setPermissionGranted] = useState({});
  const [qrData, setQrData] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (videoStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      const scan = () => {
        const videoWidth = video.width;
        const videoHeight = video.height;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
          const imageData = canvasContext.getImageData(
            0,
            0,
            videoWidth,
            videoHeight
          );

          //이미지 데이터 디코딩
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setQrData(code.data);
          }
        }
        requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    }
  }, [permissionGranted, videoStream]);

  useEffect(() => {
    if (qrData) {
      //데이터베이스에서 보내는 작업
      toast.success(`${qrData}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      alert("성공");
    }
  }, []);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        // 뒤카메라 키기
        const stream = navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "enviroment",
          },
        });

        setVideoStream(stream);
        setPermissionGranted(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (permissionGranted === null) {
      requestCameraPermission();
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [permissionGranted, videoStream]);

  //위도 경도 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocations({ latitude, longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.error("브라우저가 Geolocation API를 지원하지 않습니다.");
    }
  }, []);

  console.log(userLocation);

  return (
    <>
      <div className="max-w-sm mx-auto w-full h-[500px">
        <div className="w-full flex justify-between">
          <div>
            <IoIosMenu size={28} />
          </div>
          <div className="flex gap-4">
            <p>login</p>
            <p>signin</p>
          </div>
        </div>
        <h1 className=" font-bold text-gray-900 py-4 text-center border-b border-gray-400">
          QR Scanner
        </h1>
        <div className=" relative w-full h-[500px] border border-gray-400">
          <video
            className="absolute top-0 left-0 w-full h-full"
            id="videoElement"
            ref={videoRef}
            autoPlay={true}
            playsInline
          ></video>
          <canvas
            className="absolute top-0 left-0 w-full h-full"
            id="canvasElement"
            ref={canvasRef}
          ></canvas>
        </div>
      </div>
    </>
  );
}

export default App;
