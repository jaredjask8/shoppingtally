package com.app.shoppingtally.affiliate;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AffiliateWebDriver {
	public void startDriver(){
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\jared\\dev\\chrome-headless\\chrome-headless-shell.exe");
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--remote-allow-origins=*");
		WebDriver driver = new ChromeDriver(options);
		driver.get("https://www.selenium.dev/selenium/web/web-form.html");
		log.info(driver.getTitle());
		
	}
}
