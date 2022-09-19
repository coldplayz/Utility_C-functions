#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))




void test2(void);
void test(void);


int main(void)
{
	int i;
	char str[] = "string";

	test();
	ps("####################################################################################");
	test2();
	ps("####################################################################################");


	return (0);
}



void test2(void)
{
	int i;

	char *ptc1[6];
	static char *ptc2[6];

	for (i = 0; i < 6; i++)
	{
		printf("ptc1[%d]: %p\nptc2[%d]: %p\n+++++++++++++++++++++++\n", i, &ptc1[i], i, &ptc2[i]);
	}
}

void test(void)
{
	test2();
}
