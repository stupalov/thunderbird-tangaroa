import AppKit
// usage: render-icon.swift in.svg out.png width [height]   (height defaults to width)
let a = CommandLine.arguments
guard let img = NSImage(contentsOf: URL(fileURLWithPath: a[1])) else { fatalError("load") }
let w = Int(a[3])!
let h = a.count > 4 ? Int(a[4])! : w
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSGraphicsContext.current!.imageInterpolation = .high
img.draw(in: NSRect(x: 0, y: 0, width: w, height: h))
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
