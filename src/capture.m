// capture image from webcam(e.g. face time)
// for OSX 10.9 (use AVFoundation API instead of deprecated QTKit)
// clang -fobjc-arc -Wall -Wextra -pedantic avcapture.m 
//    -framework Cocoa -framework AVFoundation -framework CoreMedia 
//    -framework QuartzCore -o avcapture

#import <AVFoundation/AVFoundation.h>
#import <AppKit/AppKit.h>

@interface Capture : NSObject <AVCaptureVideoDataOutputSampleBufferDelegate>
@property (weak) AVCaptureSession* session;
- (void) captureOutput: (AVCaptureOutput*) output
 didOutputSampleBuffer: (CMSampleBufferRef) buffer
        fromConnection: (AVCaptureConnection*) connection;
//- (void) captureOutput: (AVCaptureOutput*) output
//   didDropSampleBuffer: (CMSampleBufferRef) buffer
//        fromConnection: (AVCaptureConnection*) connection;
@end
@interface Capture ()
{
  CVImageBufferRef head;
  CFRunLoopRef runLoop;
  int count;
}
- (void) save;
@end

@implementation Capture
@synthesize session;

- (id) init
{
  self = [super init];
  runLoop = CFRunLoopGetCurrent();
  head = nil;
  count = 0;
  return self;
}

- (void) dealloc
{
  @synchronized (self) {
    CVBufferRelease(head);
  }
  NSLog(@"capture released");
}

- (void) save
{
  @synchronized (self) {
    CIImage* ciImage = 
      [CIImage imageWithCVImageBuffer: head];
    NSBitmapImageRep* bitmapRep = 
      [[NSBitmapImageRep alloc] initWithCIImage: ciImage];
    
    NSFileHandle *stdout = [NSFileHandle fileHandleWithStandardOutput];
    NSData* jpgData = 
      [bitmapRep representationUsingType:NSJPEGFileType properties: nil];
    [stdout writeData: jpgData];
    // [jpgData writeToFile: stdout atomically: NO];
    //NSData* pngData = 
    //  [bitmapRep representationUsingType:NSPNGFileType properties: nil];
    //[pngData writeToFile: @"result.png" atomically: NO];
  }
  NSLog(@"Saved");
}

- (void) captureOutput: (AVCaptureOutput*) output
   didOutputSampleBuffer: (CMSampleBufferRef) buffer
        fromConnection: (AVCaptureConnection*) connection 
{
#pragma unused (output)
#pragma unused (connection)
  CVImageBufferRef frame = CMSampleBufferGetImageBuffer(buffer);
  CVImageBufferRef prev;
  CVBufferRetain(frame);
  @synchronized (self) {
    prev = head;
    head = frame;
    count++;
    NSLog(@"Captured");
  }
  CVBufferRelease(prev);
  if (count == 6) {
    // after skipped 5 frames
    [self save];
    [self.session stopRunning];
    CFRunLoopStop(runLoop);
  }
}
//- (void) captureOutput: (AVCaptureOutput*) output
//   didDropSampleBuffer: (CMSampleBufferRef) buffer
//        fromConnection: (AVCaptureConnection*) connection 
//{
//#pragma unused (output)
//#pragma unused (buffer)
//#pragma unused (connection)
//}
@end

AVCaptureDevice* frontCamera() {
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for (AVCaptureDevice *device in devices) {
        // if ([device position] == AVCaptureDevicePositionFront) {
            return device;
        // }
    }
    return nil;
}

int quit(NSError * error)
{
  NSLog(@"[error] %@", [error localizedDescription]);
  return 1;
}

int main( int argc, const char* argv[])
{
  NSError* error = nil;
  Capture* capture = [[Capture alloc] init];
  
  //NSArray* devices = 
  //  [AVCaptureDevice devicesWithMediaType: AVMediaTypeVideo];
  //AVCaptureDevice* device = [devices objectAtIndex: 0];
  AVCaptureDevice* device = frontCamera();
    // [AVCaptureDevice defaultDeviceWithMediaType: AVMediaTypeVideo];
  NSLog(@"[device] %@", device);
  
  AVCaptureDeviceInput* input = 
    [AVCaptureDeviceInput deviceInputWithDevice: device  error: &error];
  NSLog(@"[input] %@", input);
  
  AVCaptureVideoDataOutput* output =
    [[AVCaptureVideoDataOutput alloc] init];
  [output setSampleBufferDelegate: capture queue: dispatch_get_main_queue()];
  NSLog(@"[output] %@", output);
  
  AVCaptureSession* session = [[AVCaptureSession alloc] init];
  [session addInput: input];
  [session addOutput: output];
  
  capture.session = session;
  [session startRunning];
  NSLog(@"Started");
  CFRunLoopRun();
  
  NSLog(@"Stopped");
  return 0;
}
