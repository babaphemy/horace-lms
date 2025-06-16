const FailedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Payment Failed</h1>
      <p className="mt-4 text-gray-600">
        Your payment was not successful. Please try again.
      </p>
    </div>
  )
}
export default FailedPage
