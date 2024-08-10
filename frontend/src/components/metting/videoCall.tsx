import React, { useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { RootState } from '../../store/store';
import socket from '../../../utils/socket';
import '../../zego.css'


interface Props {
  role: 'dev' | 'companies';
}

type ZegoInstance = ReturnType<typeof ZegoUIKitPrebuilt.create>;




const VideoCall: React.FC<Props> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state;
  const { _id, name } = useSelector((state: RootState) => {
    return role === 'companies' ? state.companyRegisterData : state.developerRegisterData;
  });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const hasJoinedRoom = useRef(false);
  const zpRef = useRef<ZegoInstance | null>(null);

  const handleLeaveRoom = useCallback(async (zp: ZegoInstance) => {
    zp.destroy();
    socket.emit('leaveRoom', { _id, roomId }, (response: string) => {
      if (response === 'success') {
        if (role === 'dev') {
          navigate('/dev/meeting');
        } else {
          navigate('/company/meeting');
        }
      }
    });
  }, [role, navigate, _id, roomId]);

  useEffect(() => {
    const newMeeting = async (element: HTMLDivElement) => {
      try {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(import.meta.env.VITE_ZEGO_APP_ID),
          import.meta.env.VITE_ZEGO_SERVER_SECRET,
          roomId,
          _id,
          name
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Room Id",
              url: roomId,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          onLeaveRoom: () => handleLeaveRoom(zp),
        });
      } catch (error) {
        console.error('Failed to initialize or join room:', error);
      }
    };

    if (videoContainerRef.current && !hasJoinedRoom.current) {
      hasJoinedRoom.current = true;
      newMeeting(videoContainerRef.current);
    }
  }, [roomId, name, _id, handleLeaveRoom]);

  

  return (
    <div className='absolute top-0 left-0 bottom-0 right-0 h-screen w-screen p-20 z-10'>
     
      <div className='absolute top-0 left-0 bottom-0 right-0 h-screen w-screen z-10' ref={videoContainerRef} />
  
    </div>
  );
};

export default VideoCall;
