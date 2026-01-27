#!/bin/bash

# Docker build script for Sudoku Learning Game
# Usage: ./scripts/docker-build.sh [version]

set -e

# Configuration
IMAGE_NAME="sudoku-game"
REGISTRY="${DOCKER_REGISTRY:-}"
VERSION="${1:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building Sudoku Learning Game Docker image...${NC}"
echo "Image: ${IMAGE_NAME}:${VERSION}"

# Build the image
docker build \
  --tag "${IMAGE_NAME}:${VERSION}" \
  --tag "${IMAGE_NAME}:latest" \
  --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  --build-arg VERSION="${VERSION}" \
  .

# Check image size
IMAGE_SIZE=$(docker image inspect "${IMAGE_NAME}:${VERSION}" --format='{{.Size}}')
IMAGE_SIZE_MB=$((IMAGE_SIZE / 1024 / 1024))

echo -e "${GREEN}Build complete!${NC}"
echo "Image size: ${IMAGE_SIZE_MB}MB"

# Verify size requirement (< 50MB)
if [ ${IMAGE_SIZE_MB} -gt 50 ]; then
  echo -e "${YELLOW}Warning: Image size (${IMAGE_SIZE_MB}MB) exceeds 50MB target${NC}"
else
  echo -e "${GREEN}✓ Image size is within 50MB target${NC}"
fi

# Tag for registry if specified
if [ -n "${REGISTRY}" ]; then
  echo -e "${GREEN}Tagging for registry: ${REGISTRY}${NC}"
  docker tag "${IMAGE_NAME}:${VERSION}" "${REGISTRY}/${IMAGE_NAME}:${VERSION}"
  docker tag "${IMAGE_NAME}:latest" "${REGISTRY}/${IMAGE_NAME}:latest"
  
  echo "To push to registry, run:"
  echo "  docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
  echo "  docker push ${REGISTRY}/${IMAGE_NAME}:latest"
fi

echo ""
echo "To run the container:"
echo "  docker run -d -p 8080:80 --name sudoku ${IMAGE_NAME}:${VERSION}"
echo ""
echo "Then open http://localhost:8080 in your browser"
