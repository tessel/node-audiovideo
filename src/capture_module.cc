// addon.cc
#include <node.h>
#include <nan.h>
// ...

using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;

extern "C" char* camera_capture(size_t* size);

// Simple synchronous access to the `Estimate()` function
NAN_METHOD(CaptureSync) {
	NanScope();
	size_t size = 0;
	char* ptr = camera_capture(&size);
	NanReturnValue(NanBufferUse(ptr, size));
}

void InitAll(Handle<Object> exports) {
  exports->Set(NanNew<String>("capture"),
    NanNew<FunctionTemplate>(CaptureSync)->GetFunction());
}

NODE_MODULE(capture, InitAll)
