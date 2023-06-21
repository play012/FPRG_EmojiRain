using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class WebcamTexture : MonoBehaviour
{
    [SerializeField] RawImage webcamRawImage;

    // Start is called before the first frame update
    void Start()
    {
        WebCamTexture webcamT = new WebCamTexture();
        webcamRawImage.texture = webcamT;
        webcamRawImage.material.mainTexture = webcamT;
        webcamT.Play();
    }
}
