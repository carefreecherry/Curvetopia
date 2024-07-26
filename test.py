import numpy as np
import matplotlib.pyplot as plt
from skimage.feature import peak_local_max

def read_csv(csv_path):
    np_path_XYs = np.genfromtxt(csv_path, delimiter=',')
    path_XYs = []
    for i in np.unique(np_path_XYs[:, 0]):
        npXYs = np_path_XYs[np_path_XYs[:, 0] == i][:, 1:]
        XYs = []
        for j in np.unique(npXYs[:, 0]):
            XY = npXYs[npXYs[:, 0] == j][:, 1:]
            XYs.append(XY)
        path_XYs.append(XYs)
    return path_XYs

def plot(paths_XYs):
    fig, ax = plt.subplots(tight_layout=True, figsize=(8, 8))
    for i, XYs in enumerate(paths_XYs):
        for XY in XYs:
            ax.plot(XY[:, 0], XY[:, 1], c='red', linewidth=2)
    ax.set_aspect('equal')
    plt.show()

def hough_line(paths_XYs):
    theta = np.deg2rad(np.arange(0, 360))  # Range of theta from -90 to 89 degrees
    r_max = 0
    for curve in paths_XYs:
        for points in curve:
            cr_max = np.hypot(points[:, 0].max(), points[:, 1].max())  # Max diagonal distance in data
            if cr_max > r_max:
                r_max = cr_max
    r = np.linspace(-r_max, r_max, 400)  # Range of r
    accumulator = np.zeros((len(r), len(theta)), dtype=int)
    for curve in paths_XYs:
        for points in curve:
            for x, y in points:
                for idx, t in enumerate(theta):
                    rho = x * np.cos(t) + y * np.sin(t)
                    rho_idx = np.abs(r - rho).argmin()
                    accumulator[rho_idx, idx] += 1

    # Detect peaks in the accumulator
    coordinates = peak_local_max(accumulator, min_distance=20, threshold_abs=60)

    # Plotting the Hough Transform
    plt.imshow(accumulator, aspect='auto', extent=[np.rad2deg(theta.min()), np.rad2deg(theta.max()), r.min(), r.max()])
    plt.title('Hough Transform')
    plt.xlabel('Theta (degrees)')
    plt.ylabel('Rho')
    plt.colorbar()
    plt.show()

    # Plot the detected lines on the original plot
    fig, ax = plt.subplots(tight_layout=True, figsize=(8, 8))
    for y, x in coordinates:  # Note: `x` is theta index, `y` is rho index here
        rho = r[y]
        t = theta[x]
        a = np.cos(t)
        b = np.sin(t)
        x0 = a * rho
        y0 = b * rho
        x1 = int(x0 + 0 * (-b))
        y1 = int(y0 + 0 * (a))
        x2 = int(x0 - 300 * (-b))
        y2 = int(y0 - 400 * (a))
        ax.plot([x1, x2], [y1, y2], 'r')

    # Plot all points from all curves
    for i, XYs in enumerate(paths_XYs):
        for XY in XYs:
            ax.plot(XY[:, 0], XY[:, 1], c='blue', linewidth=2)

    ax.set_aspect('equal')
    plt.show()

# Example usage
paths_XYs = read_csv('problems/frag0.csv')
plot(paths_XYs)
hough_line(paths_XYs)