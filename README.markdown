![browseTunes plays audio and video](browseTunes/raw/master/browseTunes.jpg "browseTunes")

# browseTunes :: 100% HTML5/Javascript, iTunes-Compatible Media Player

browseTunes.js is a javascript media player, leveraging the HTML 5 API - Audio/Video tags, File API and Local Storage - to provide a iTunes-like experience within modern web browsers.

When linked into the head tag of an HTML file:

    <script type="text/javascript" src="browseTunes.js"></script>

browseTunes creates the familiar 'Genre -> Artist -> Album -> Track' Navigation system of the original iTunes. Drag and Drop or upload your exported iTunes Music Library and browseTunes parses the library into your browser's local storage. A Genre, Artist, Album and Track database is created to store the index locally of all your content.  Browse content by clicking on any of the Genre, Artist or Album Tags and play content by clicking on the Track.

## Note: Currently only works in Webkit. Will work in Chrome if I can get around file:/// sandboxing. Firefox doesn't seem to support Local Storage yet. Damn.

## Features:

 * Drag and Drop / 'Upload' iTunes Library
 * Audio and Video Playback in the browser
 * Full-Screen Popup for video playback on external monitor
 * 'Genre -> Artist -> Album -> Track' Navigation.
 * Mp3/Mp4 Safari and Chrome Support
 * Ogg/Theora Firefox Support
 * Media Scrubbing, fast-forward & rewind
 * Continuous Playback
 * Search

Dedicated, in loving memory, to the original iTunes. With it's lightweight footprint and Genre -> Artist -> Album -> Track navigation system.
You were missed.

## Instructions:

 * STEP 1: Put browseTunes and index.html in your iTunes Directory.
 * STEP 2: Export your iTunes Library to xml.

Open iTunes. Chose 'File', 'Libary', 'Export Libary' and save Library.xml to your iTunes Directory.

* STEP 3: Open index.html in your web browser. ** See Note 1.
* STEP 4: Drag and Drop or Upload your Library.xml

## Disclaimer:

 * Mp3 = Safari/Chrome, Ogg = Firefox
If you music and video is encoded to Mp3 and Quicktime,this will ONLY WORK IN SAFARI OR CHROME. If your music is encoded to Ogg, this WILL ONLY WORK IN FIREFOX.
 * Only works with non-protected media.
Will not work with protected media bought through iTunes.
 * You media folder will need to be accessible.
Otherwise you will get a Forbidden 403 error.

## MIT License:
browseTunes (c) 2011 Ty Rauber, tyrauber@mac.com
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.