type ModalProps = {
  children?: React.ReactNode,
  isOpen: boolean,
  handleClose: (event: React.MouseEvent<HTMLDivElement>) => void,
  className?: string
}

export default function Modal({ children, isOpen, className, handleClose }: ModalProps) {
  return (
    <>
      {
        isOpen && (
          <div onClick={handleClose} className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-black/40 z-10">
            <div onClick={(e) => { e.stopPropagation() }} className={`bg-white shadow rounded-md ${className}`}>
              {children}
            </div>
          </div>
        )
      }
    </>
  )
}