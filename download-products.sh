#!/bin/bash

DIR="public/assets/products"

mkdir -p "$DIR"

curl -L "https://images.pexels.com/photos/28842075/pexels-photo-28842075.jpeg"     -o "$DIR/keyboard-01.jpg"
curl -L "https://images.pexels.com/photos/7265920/pexels-photo-7265920.jpeg"     -o "$DIR/keyboard-02.jpg"

curl -L "https://images.pexels.com/photos/7172686/pexels-photo-7172686.jpeg"        -o "$DIR/mouse-01.jpg"
curl -L "https://images.pexels.com/photos/13870518/pexels-photo-13870518.jpeg"        -o "$DIR/mouse-02.jpg"

curl -L "https://images.pexels.com/photos/10670819/pexels-photo-10670819.jpeg"        -o "$DIR/audio-01.jpg"
curl -L "https://images.pexels.com/photos/3585797/pexels-photo-3585797.jpeg"        -o "$DIR/audio-02.jpg"

curl -L "https://images.pexels.com/photos/27467772/pexels-photo-27467772.jpeg"         -o "$DIR/desk-01.jpg"
curl -L "https://images.pexels.com/photos/13766004/pexels-photo-13766004.jpeg"         -o "$DIR/desk-02.jpg"

curl -L "https://images.pexels.com/photos/5576311/pexels-photo-5576311.jpeg" -o "$DIR/connectivity-01.jpg"
curl -L "https://images.pexels.com/photos/3921695/pexels-photo-3921695.jpeg" -o "$DIR/connectivity-02.jpg"

curl -L "https://images.pexels.com/photos/13399388/pexels-photo-13399388.jpeg"        -o "$DIR/light-01.jpg"
curl -L "https://images.pexels.com/photos/33181511/pexels-photo-33181511.jpeg"        -o "$DIR/light-02.jpg"

echo "✅ Imágenes descargadas"