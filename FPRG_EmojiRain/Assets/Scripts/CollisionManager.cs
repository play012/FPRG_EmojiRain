using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CollisionManager : MonoBehaviour
{
    public int hitCounter;

    [SerializeField] CloudManager cloudManager;
    [SerializeField] Texture emojiTexture;
    [SerializeField] GameObject[] hearts;
    [SerializeField] GameObject cloudGO, buttonGO;

    void OnTriggerEnter2D(Collider2D other) {
        if(other.gameObject.tag == "Emoji") {
            cloudManager.lastEmoji = "";
            RawImage emojiImg = other.transform.GetChild(0).gameObject.GetComponent<RawImage>();
            emojiImg.texture = emojiTexture;
            hearts[hitCounter].SetActive(false);
            hitCounter--;

            if (hitCounter == -1) {
                cloudGO.transform.position = new Vector3(0f, 3f, -0.1f);
                buttonGO.SetActive(true);
                foreach (GameObject heartGO in hearts) {
                    heartGO.SetActive(true);
                }

                var clones = GameObject.FindGameObjectsWithTag("Emoji");
                foreach (var clone in clones) {
                    Destroy(clone);
                }
            }
        }
    }

    public void ResetHits() {
        hitCounter = hearts.Length - 1;
    }

    void Start() {
        ResetHits();
    }
}
